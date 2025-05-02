export interface SuccessResponse<Data> {
  message: string
  data: Data
}
export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

//* Cú pháp `-?` trong mapped types là để loại bỏ các thuộc tính có giá trị undefined trong TypeScript.
//* Điều này có nghĩa là nếu một thuộc tính có thể là undefined, nó sẽ không được bao gồm trong kiểu mới.
export type NoUndefinedField<T> = {
  [K in keyof T]-?: NoUndefinedField<NonNullable<T[K]>>
}
