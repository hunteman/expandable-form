export interface FormField {
    title: string | null;
    slug: any | null;
    type: string | null;
    placeholder: string | null;
    configuration: any;
    validation: Array<Validation> | [];
}

export interface Validation {
    type: string | null;
    text: string | null;
}

export interface Checkbox {
    id: number | null;
    title: string | null;
}