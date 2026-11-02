import React from "react";

type FieldProps = {
    id: string;
    label: string;
    required?: boolean;
    error?: string;
    hint?: React.ReactNode;
    children: React.ReactNode;
};

export const Field = (props: FieldProps) => {
    return (
        <div>
            <label htmlFor={props.id} className="mb-2 block text-sm font-semibold tracking-wide text-brand">
                {props.label}
                {props.required && <span className="ml-1 text-red-600">*</span>}
            </label>
            {props.children}
            {props.hint}
            {props.error && (
                <p id={`${props.id}-error`} role="alert" className="mt-1 text-sm text-red-600">
                    {props.error}
                </p>
            )}
        </div>
    );
};
