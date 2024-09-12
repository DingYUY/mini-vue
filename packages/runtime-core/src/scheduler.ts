
const microQueue: any[] = []
const activePreFlushCbs: any[] = []

let isFlushPending = false
const p = Promise.resolve()

export function nextTick(fn?: any) {
  return fn ? p.then(fn) : p
}

export function queueJobs(job: any) { 
  // 同步时将 job 放入微任务队列， 异步执行
  // 只放入一次队列
  if (!microQueue.includes(job)) { 
    microQueue.push(job)
  }

  queueFlush()
}

export function queuePreFlushCb(cb: any) {
  activePreFlushCbs.push(cb)

  queueFlush();
}

function queueFlush() { 
  // promise只创建一次
  if (isFlushPending) return
  isFlushPending = true

  nextTick(flushJobs)
}

function flushJobs() { 
  isFlushPending = false

  flushPreFlushCbs()  

  // component render
  let job: any
  while ((job = microQueue.shift())) { 
    // 调用 update， 更新视图
    console.log('update async=====')
    job && job()
  }
}

function flushPreFlushCbs() {
  for (let i = 0; i < activePreFlushCbs.length; i++) {
    activePreFlushCbs[i]()
  }
}