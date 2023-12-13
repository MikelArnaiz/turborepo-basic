'use client'

import { Button, Header } from 'marnaiz-turborepo-ui'
import { add } from '@catawiki/poc-math'
import { useReducer } from 'react'

const onClick = () => {
  alert('you clicked')
}

export default function Page() {
  const [counter, increment] = useReducer(add(1), 0)

  return (
    <>
      <Header text="this is the apps/web page" />
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut fugiat suscipit, neque nam numquam officiis
        molestiae excepturi harum a assumenda, quaerat aspernatur laborum! Quo possimus repudiandae ea eaque ex? Quis?
      </p>
      <Button onClick={onClick} />
      <hr />
      <p>Counter: {counter}</p>
      <button onClick={increment}>Increment</button>
    </>
  )
}
