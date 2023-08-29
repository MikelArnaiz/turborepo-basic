'use client'

import { Button, Header } from 'marnaiz-turborepo-ui'

const onClick = () => {
  alert('you clicked')
}

export default function Page() {
  return (
    <>
      <Header text="Web" />
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut fugiat suscipit, neque nam numquam officiis
        molestiae excepturi harum a assumenda, quaerat aspernatur laborum! Quo possimus repudiandae ea eaque ex? Quis?
      </p>
      <Button onClick={onClick} />
    </>
  )
}
