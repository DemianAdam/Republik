export type Variant = (typeof VARIANT)[keyof typeof VARIANT]

export const VARIANT = {
    DANGER: "danger",
    WARNING: "warning",
    OK: "ok"
} as const

export const VARIANT_STYLES = {
    danger: {
        button: "bg-red-600 hover:bg-red-600 shadow-red-600/20",
    },
    warning: {
        button: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
    },
    ok: {
        button: "bg-red-600 hover:bg-red-600 shadow-red-600/20",
    }
} as const satisfies Record<Variant, Record<string, string>>