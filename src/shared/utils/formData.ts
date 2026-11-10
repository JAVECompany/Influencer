export const readFormValue = (data: FormData, key: string) => String(data.get(key) ?? '')
