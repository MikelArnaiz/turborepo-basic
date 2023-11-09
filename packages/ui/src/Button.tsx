'use client'

import * as React from 'react'

type ButtonProps = {
  onClick(): void
}

export const Button = ({ onClick }: ButtonProps) => {
  return <button onClick={onClick}>This is the version 15 of this button</button>
}
