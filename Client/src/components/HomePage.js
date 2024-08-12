import SushiBG from '../images/1625260162_1-kartinkin-com-p-fon-dlya-menyu-sushi-krasivie-foni-1.jpg'

function HomePage() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <img
        src={SushiBG}
        alt="Background GIF"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="flex justify-center items-center h-full w-full text-bold text-6xl pt-6 relative z-10 text-white">
        <p>Выберите категорию</p>
      </div>
    </div>
  );
};

export default HomePage;