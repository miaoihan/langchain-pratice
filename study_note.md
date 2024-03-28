# langchain学习笔记

## 概念

### [RunnablePassthrough类](https://api.js.langchain.com/classes/langchain_core_runnables.RunnablePassthrough.html)

可以理解为，把invoke里的string，转成object
example：

```ts
await chatChain.invoke("Hello");
const chain2 = RunnableSequence.from([
  {
    question: new RunnablePassthrough(),
  },
  prompt,
]);
```

相当于把字符串"hello"转成了 **{question:"Hello"}** 对象

#### RunnablePassthrough.assign()
加入新的字段，
example：

```ts
RunnablePassthrough.assign({
  context: 'context'
})
```

此时对象就变成了 **{question:"Hello", context:"context"}**

## Runnable
可运行对象，可以看做是一个函数，接受输入，处理后输出

### RunnableWithMessageHistory
