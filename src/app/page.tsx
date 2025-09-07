import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans items-center justify-items-center min-h-screen p-2 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert mx-auto"
          src="/login.svg"
          alt="login logo"
          width={180}
          height={38}
          priority
        />
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <form className="space-y-4">
<div>
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    Correo Electronico
  </label>
  <input type="email" id="email" placeholder="correo@gmail.com" 
  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  required/>
</div>
<div>
  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
    Contraseña
  </label>
  <input type="password" id="password" placeholder="********" 
  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  required/>
</div>
<button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
  Entrar 
</button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-600 ">
¿ No tienes cuenta? <a href="/register" className="text-blue-600 hover:underline">
  Registrate
</a>
          </p>
      </main>
      <footer className=" fixed bottom-0 w-full text-center py-4">
        <h3>
          Sistema  de Gestion de Proyectos
        </h3>
      </footer>
    </div>
  );
}
