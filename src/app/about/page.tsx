import { Metadata } from 'next';
import React from 'react'

export const metadata:Metadata={
  title:"About"
}
function about() {
  return (
    <div>
      this is about section
    </div>
  )
}

export default about
