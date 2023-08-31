'use client'

import * as React from 'react'

type ButtonProps = {
  onClick(): void
}

export const Button = ({ onClick }: ButtonProps) => {
  return <button onClick={onClick}>Boop v9</button>
}
