current View -> target View

| Path     | View         |
| -------- | ------------ |
| /        | Home         |
| blog     | Blog         |
| blog/    | BlogPaper    |
| devlog   | Devlog       |
| devlog/  | DevlogBinder |
| devlog// | DevlogPaper  |
| about    | About        |

``` cs
1. get target view path ( string )
2. wait promise ( from store.ts )
3. get wait time
4. execute transition with wait time
```
