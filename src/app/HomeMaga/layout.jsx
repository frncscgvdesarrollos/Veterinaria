'use client'
import { useState , useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import { redirect } from 'next/navigation'
import { getTurnosChekeo } from '../firebase';

export default function LayoutNegocio( { children } ) {
  return (
    <div>
      { children }
    </div>
  )
}
