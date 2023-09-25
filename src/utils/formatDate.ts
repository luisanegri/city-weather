import format from "date-fns/format";

export const formatDate = (date: string) => {
    return format(new Date(date), 'MMMM d, yyyy, h:mm a');
}
