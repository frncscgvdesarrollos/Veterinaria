import Image from 'next/image'; // Importar Image desde next/image

export default function Footer() {

  return (
    <footer className="gradient-bg p-6 sm:p-12 flex flex-col sm:flex-row items-center">
      <div className="w-full sm:w-1/2 flex flex-col items-center justify-between">
        <div className="mb-8 sm:mb-0 rounded-lg p-4">
          <p className="text-2xl sm:text-4xl font-bold text-center text-gray-500 uppercase">
            Urgencias - Sabados y Domingos
          </p>
          <p className="text-2xl font-bold text-center text-red-500 ">
            Tel: 2954-.....
          </p>
        </div>
        <Image
          src="/LOGO3.svg"
          alt="logo"
          width={100}
          height={100}
        />
      </div>
    </footer>
  );
}
