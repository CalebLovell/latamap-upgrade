export const formatDateParam = (d: Date) =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const parseDateParam = (s: string) => {
	const [y, m, d] = s.split("-").map(Number);
	const date = new Date(y, m - 1, d);
	if (Number.isNaN(date.getTime())) return new Date();
	const min = new Date(1789, 0, 1);
	const max = new Date();
	if (date < min) return min;
	if (date > max) return max;
	return date;
};
