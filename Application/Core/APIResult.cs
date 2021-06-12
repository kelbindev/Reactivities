namespace Application.Core
{
    public class APIResult<T>
    {
        public bool isSucess{get;set;}
        public T Value{get;set;}
        public string Error{get;set;}

        public static APIResult<T> Sucess(T _Value) => new APIResult<T> {
            isSucess = true,
            Value = _Value
        };

        public static APIResult<T> Fail(string _Error) => new APIResult<T> {
            isSucess = false,
            Error = _Error
        };
    }
}