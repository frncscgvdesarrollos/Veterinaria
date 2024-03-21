'use client'
import { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';

export default function Footer() {
  const { user } = UserAuth();
  const uid = user?.uid;

  if (uid === process.env.NEXT_PUBLIC_ADMIN_UID) {
    return (
      <footer className="bg-gray-200 p-6 sm:p-10 flex flex-col sm:flex-row items-center footerContainer">
        <div className="w-full p-4 sm:p-0 mb-6 sm:mb-0 flex justify-center items-center">
          <img
            src="/LOGO3.svg"
            alt="logo"
            className="w-32 h-32 sm:w-40 sm:h-40"
          />
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-violet-200 p-6 sm:p-10 flex flex-col sm:flex-row items-center footerContainer">
      <div className="w-full p-10 sm:p-5 rounded-lg mb-6 sm:mb-0 bg-violet-400 ">
        <h3 className="text-3xl font-bold text-center text-yellow-300 bg-gray-700 rounded-lg  p-2 mb-8">Donde estamos</h3>
        <div className="aspect-w-4 aspect-h-3">
          <iframe
            className="w-full h-full sm:w-full sm:h-96"
            loading="lazy"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3201.721227969483!2d-64.28657962513782!3d-36.63309636748743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95c2cc56aabc7413%3A0x805c03f73c325780!2sT.%20Edison%20%26%20Emilio%20Zola%2C%20Santa%20Rosa%2C%20La%20Pampa!5e0!3m2!1ses-419!2sar!4v1706387141911!5m2!1ses-419!2sar"
            style={{ border: "0" }}
            aria-hidden="false"
            tabIndex="0"
          />
        </div>
        <marquee className="text-base text-center text-yellow-300 bg-red-500 font-bold p-2 text-xl">
          ¡Recuerde que la veterinaria solo trabaja con turnos previos!
        </marquee>
      </div>
      <div className="w-full p-4 flex flex-col items-center justify-center">
        <div className="mb-8 bg-yellow-400  rounded-lg p-4">
          <p className="text-3xl font-bold text-center text-red-500 uppercase">
            Urgencias - Sabados y Domingos
          </p>
          <p className="text-3xl font-bold text-center text-red-500 bg-yellow-300">
            Tel: 2954-456-456
          </p>
        </div>
        <img
          src="/LOGO3.svg"
          alt="logo"
          className="w-48 h-48 sm:w-64 sm:h-64"
        />
      </div>
    </footer>
  );
}
