'use client'
import { useState  } from 'react'
import { UserAuth } from '../context/AuthContext';
import { getNextTurn } from '../firebase';
export default function MisTurnos() {
    const [turnos, setTurnos] = useState([])
    const { user } = UserAuth();
    if(user){
        const uid = user?.uid
        new Promise((resolve, reject) => {
            getNextTurn(uid)
            .then((turnos) => {
                setTurnos(turnos)
                resolve(turnos)
            })
            .catch((error) => {
                reject(error)
            })
        })
    }

  return (
    <div>
      <h1>Mis Turnos</h1>
      <ul>
        {turnos.map((turno, index) => (
          <li key={index}>
            {turno.selectedDate} {turno.selectedTime} {turno.selectedPet}
          </li>
        ))}
      </ul>
    </div>
  )
}
