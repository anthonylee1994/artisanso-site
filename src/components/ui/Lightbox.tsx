import React from "react";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import {LuFlipHorizontal2, LuFlipVertical2, LuRotateCcwSquare, LuRotateCwSquare, LuZoomIn, LuZoomOut} from "react-icons/lu";
import {LoadingProgress} from "@/components/ui/LoadingProgress";
import type {SlideDirection} from "@/hooks/useLightbox";
import type {Project} from "@/types";

type LightboxProps = {
    project: Project;
    index: number;
    direction: SlideDirection | null;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
};

type ImageView = {
    src: string;
    rotate: number;
    flipX: boolean;
    flipY: boolean;
    zoom: number;
    x: number;
    y: number;
};

type Point = {x: number; y: number};

type Gesture = {
    distance: number;
    zoom: number;
    anchor: Point;
    x: number;
    y: number;
};

const SWIPE_THRESHOLD = 50;
const TAP_SLOP = 8;
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_ZOOM = 2;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

function distance(a: Point, b: Point) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a: Point, b: Point): Point {
    return {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2};
}

function createView(src: string): ImageView {
    return {src, rotate: 0, flipX: false, flipY: false, zoom: MIN_ZOOM, x: 0, y: 0};
}

export const Lightbox = (props: LightboxProps) => {
    const {project, index} = props;
    const image = project.images[index];
    const dialogRef = React.useRef<HTMLDivElement>(null);
    const pointers = React.useRef(new Map<number, Point>());
    const gesture = React.useRef<Gesture | null>(null);
    const swipeStart = React.useRef<Point | null>(null);
    const moved = React.useRef(false);
    const lastTap = React.useRef(0);
    const [dragging, setDragging] = React.useState(false);
    const [storedView, setView] = React.useState(() => createView(image.src));
    const [settledSrc, setSettledSrc] = React.useState<string | null>(null);
    const multiple = project.images.length > 1;
    const loading = settledSrc !== image.src;

    // 換相就重設變換，唔使用 effect 避免閃一格舊狀態
    const view = storedView.src === image.src ? storedView : createView(image.src);
    const zoomed = view.zoom > MIN_ZOOM;

    const rotateBy = (delta: number) => setView({...view, rotate: view.rotate + delta});

    // 旋轉 90° 後，畫面嘅水平方向就係圖片本身嘅垂直軸，所以要對調
    const flip = (horizontal: boolean) => {
        const swapped = (Math.abs(view.rotate / 90) & 1) === 1;
        const axisX = horizontal !== swapped;
        setView(axisX ? {...view, flipX: !view.flipX} : {...view, flipY: !view.flipY});
    };

    const zoomBy = (delta: number) => {
        const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.zoom + delta));
        setView(zoom === MIN_ZOOM ? {...view, zoom, x: 0, y: 0} : {...view, zoom});
    };

    const update = (patch: Partial<ImageView>) => setView(prev => ({...(prev.src === image.src ? prev : createView(image.src)), ...patch}));

    // 以目前所有手指為基準，重新記低拖動 / 縮放嘅起點
    const beginGesture = () => {
        const [a, b] = [...pointers.current.values()];
        if (!a) {
            gesture.current = null;
            return;
        }
        gesture.current = {distance: b ? distance(a, b) : 0, zoom: view.zoom, anchor: b ? midpoint(a, b) : a, x: view.x, y: view.y};
    };

    const onPointerDown = (e: React.PointerEvent) => {
        if ((e.target as HTMLElement).closest("button")) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        pointers.current.set(e.pointerId, {x: e.clientX, y: e.clientY});
        if (pointers.current.size === 1) {
            moved.current = false;
            swipeStart.current = e.pointerType === "mouse" ? null : {x: e.clientX, y: e.clientY};
        } else {
            moved.current = true;
            swipeStart.current = null;
        }
        beginGesture();
        setDragging(true);
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!pointers.current.has(e.pointerId)) return;
        pointers.current.set(e.pointerId, {x: e.clientX, y: e.clientY});
        const g = gesture.current;
        if (!g) return;
        const [a, b] = [...pointers.current.values()];
        if (b) {
            const mid = midpoint(a, b);
            const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, (g.zoom * distance(a, b)) / g.distance));
            update({zoom, x: g.x + mid.x - g.anchor.x, y: g.y + mid.y - g.anchor.y});
        } else {
            if (Math.hypot(a.x - g.anchor.x, a.y - g.anchor.y) > TAP_SLOP) moved.current = true;
            if (view.zoom > MIN_ZOOM) update({x: g.x + a.x - g.anchor.x, y: g.y + a.y - g.anchor.y});
        }
    };

    const onPointerUp = (e: React.PointerEvent) => {
        if (!pointers.current.delete(e.pointerId)) return;
        if (pointers.current.size > 0) {
            beginGesture();
            return;
        }
        const start = swipeStart.current;
        swipeStart.current = null;
        gesture.current = null;
        setDragging(false);
        if (view.zoom <= MIN_ZOOM && (view.x !== 0 || view.y !== 0)) update({x: 0, y: 0});
        if (e.type !== "pointerup") return;

        // 未放大時橫向掃動換相
        if (start && view.zoom <= MIN_ZOOM) {
            const dx = e.clientX - start.x;
            if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(e.clientY - start.y)) {
                if (dx > 0) props.onPrev();
                else props.onNext();
                return;
            }
        }

        // 雙擊圖片：放大 / 還原
        if (!moved.current && e.pointerType !== "mouse" && (e.target as HTMLElement).tagName === "IMG") {
            if (e.timeStamp - lastTap.current < DOUBLE_TAP_MS) {
                lastTap.current = 0;
                update(zoomed ? {zoom: MIN_ZOOM, x: 0, y: 0} : {zoom: DOUBLE_TAP_ZOOM});
            } else {
                lastTap.current = e.timeStamp;
            }
        }
    };

    // 開啟時 focus 入 dialog
    React.useEffect(() => {
        dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, []);

    // Focus trap
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key !== "Tab") return;
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    const imageAnimation = props.direction === "next" ? "animate-lightbox-slide-next" : props.direction === "prev" ? "animate-lightbox-slide-prev" : "animate-lightbox-zoom";

    const arrowClass = "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-3xl text-white hover:bg-black/70";

    const toolClass =
        "flex h-11 w-11 items-center justify-center text-2xl text-white/80 hover:text-white aria-disabled:cursor-not-allowed aria-disabled:text-white/30 aria-disabled:hover:text-white/30";

    const tools = [
        {label: "垂直翻轉", icon: LuFlipVertical2, onClick: () => flip(false), disabled: false},
        {label: "水平翻轉", icon: LuFlipHorizontal2, onClick: () => flip(true), disabled: false},
        {label: "向左旋轉", icon: LuRotateCcwSquare, onClick: () => rotateBy(-90), disabled: false},
        {label: "向右旋轉", icon: LuRotateCwSquare, onClick: () => rotateBy(90), disabled: false},
        {label: "縮小", icon: LuZoomOut, onClick: () => zoomBy(-ZOOM_STEP), disabled: view.zoom <= MIN_ZOOM},
        {label: "放大", icon: LuZoomIn, onClick: () => zoomBy(ZOOM_STEP), disabled: view.zoom >= MAX_ZOOM},
    ];

    return (
        <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={project.name}
            onKeyDown={onKeyDown}
            className="fixed inset-0 z-50 flex animate-lightbox-fade flex-col bg-black/90 motion-reduce:animate-none"
        >
            <div className="flex items-center justify-between px-4 py-3 text-white">
                <div>
                    <div className="font-bold">{project.name}</div>
                    <div className="text-sm text-white/70">
                        {index + 1} / {project.images.length}
                    </div>
                </div>
                <button type="button" aria-label="關閉" onClick={props.onClose} className="flex h-11 w-11 items-center justify-center text-3xl">
                    ×
                </button>
            </div>

            <div
                className={`relative flex flex-1 touch-none items-center justify-center overflow-hidden px-2 ${zoomed ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
                onClick={e => {
                    if (e.target === e.currentTarget && !moved.current) props.onClose();
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
            >
                <img
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    draggable={false}
                    onLoad={() => setSettledSrc(image.src)}
                    onError={() => setSettledSrc(image.src)}
                    style={{
                        translate: `${view.x}px ${view.y}px`,
                        rotate: `${view.rotate}deg`,
                        scale: `${(view.flipX ? -1 : 1) * view.zoom} ${(view.flipY ? -1 : 1) * view.zoom}`,
                    }}
                    className={`max-h-full max-w-full ${imageAnimation} object-contain select-none motion-reduce:animate-none ${dragging ? "" : "transition-[rotate,scale,translate] duration-200 motion-reduce:transition-none"}`}
                />
                {loading && <LoadingProgress />}
                {multiple && (
                    <React.Fragment>
                        <button type="button" aria-label="上一張" onClick={props.onPrev} className={`${arrowClass} left-2`}>
                            <FiChevronLeft aria-hidden="true" />
                        </button>
                        <button type="button" aria-label="下一張" onClick={props.onNext} className={`${arrowClass} right-2`}>
                            <FiChevronRight aria-hidden="true" />
                        </button>
                    </React.Fragment>
                )}
                <div role="toolbar" aria-label="圖片工具" className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/50 px-4 backdrop-blur-sm">
                    {tools.map(t => (
                        <button key={t.label} type="button" aria-label={t.label} aria-disabled={t.disabled} onClick={t.onClick} className={toolClass}>
                            <t.icon aria-hidden="true" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
