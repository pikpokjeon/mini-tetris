
  
const Pass = (e:number) => void(e)  // 이거 어떻게 해야할까


    ```
    전체 불린값에서 최종 값 판별
    isAnd([true,false,true]) // false
    isOr([true,false,true]) // true
    ```

const isAnd = (list :Array<Boolean> )=> list.reduce((acc:any, cur:any) => acc && cur, 1)

const isOr = (list :Array<Boolean> ) => list.reduce((acc:any, cur:any) => acc || cur, 0)


    ```
    조건에 따른 함수 실행
    If(condition)(              // condition = true 이면
        action(
            onTrue(()=> {}),    // 1. 실행
            onTrue(()=> {}),    // 2. 실행
            onFalse(()=> {}),   // 3. pass
        )
    )
    ```

const If = (bool:boolean) => (fn :any) => fn(bool)

const action = (...ons:Array<any>) => (bool:boolean) => ons.reduce((_, fn) => fn(bool), -1)

const onTrue =  (fn :any) => (bool:boolean)  => bool ? fn() : Pass

const onFalse =  (fn :any) => (bool:boolean)  => !bool ? fn() : Pass


    ```
    자료형
    isType.number('22') // false            
    ```

const typeOf = ['number', 'function', 'string', 'undefined', "symbol", "object"]
const initType = { array: (data:Array<any>) => Array.isArray(data), null: (data:any) => data === null }

const isType = typeOf.reduce(
    (typeObj, type) =>
        Object.assign(typeObj, { [type]: (data:any) => typeof data === type }), { ...initType })