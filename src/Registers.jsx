import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { api } from "./api";
import OutsideClickHandler from "react-outside-click-handler";
import Loader from "./Loader";

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

const Registers = ({ changeState }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [info, setInfo] = useState({});
  const [showImageDetails, setShowImageDetails] = useState(true);
  const [data, setdata] = useState([]);
  const getData = () => {
    setIsLoading(true);
    axios
      .get(`${api}/form`)
      .then((res) => {
        console.log(res);
        setdata(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <dialog id="my_modal_2" className="modal">
        <form method="dialog" className="modal-box ">
          <OutsideClickHandler onOutsideClick={pauseVideo}>
            <div className="absolute cursor-pointer top-0 right-4 modal-action">
              <button onClick={pauseVideo}>
                <svg fill="none" viewBox="0 0 15 15" height="2em" width="2em">
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M11.782 4.032a.575.575 0 10-.813-.814L7.5 6.687 4.032 3.218a.575.575 0 00-.814.814L6.687 7.5l-3.469 3.468a.575.575 0 00.814.814L7.5 8.313l3.469 3.469a.575.575 0 00.813-.814L8.313 7.5l3.469-3.468z"
                    clipRule="evenodd"
                    className=" text-red-500"
                  />
                </svg>
              </button>
            </div>
            <p className="py-4 text-center font-bold text-xl text-white">
              {info.movie}
            </p>
            {info.video && info.video.length > 0 && (
              <video
                ref={videoRef}
                className="mx-auto rounded-md"
                src={info.video}
                controls
              />
            )}
            <p className="text-center mb-3 font-bold text-white text-xl mt-5">
              {info.character}
            </p>
            {info.image && info.image.length > 0 && (
              <div className="max-w-lg relative">
                <img
                  onClick={() => setShowImageDetails(!showImageDetails)}
                  src={info.image}
                  className="mx-auto rounded-lg cursor-pointer"
                />
                <div
                  className={`absolute transition-all duration-500 ${
                    showImageDetails ? "block" : "opacity-0 "
                  } bottom-0 font-bold text-lg  bg-black bg-opacity-70 w-full text-center`}
                >
                  <div>
                    {info.person_data.gender === "M" ? "Hombre" : "Mujer"} de{" "}
                    {info.person_data.age} años
                  </div>
                  <div>Raza: {info.person_data.race}</div>
                  <div className="badge">(Informacion Aproximada)</div>
                </div>
              </div>
            )}
          </OutsideClickHandler>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <div>
        <button
          className="btn btn-info rounded-full"
          onClick={() => changeState(1)}
        >
          <svg
            viewBox="0 0 512 512"
            fill="currentColor"
            height="1em"
            className="w-7 h-7"
            width="1em"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={32}
              d="M112 160l-64 64 64 64"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={32}
              d="M64 224h294c58.76 0 106 49.33 106 108v20"
            />
          </svg>
        </button>
      </div>
      <div>
        {data.length > 0 && (
          <div className="overflow-x-auto mt-5">
            <table className="table table-zebra text-center">
              {/* head */}
              <thead>
                <tr className="text-white text-md">
                  {/* <th></th> */}
                  <th className=" ">Nombre</th>
                  {/* <th>Personaje favorito</th> */}
                  <th>Canción</th>
                  <th>Video/Imagen</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}

                {data.map((dato, i) => (
                  <tr key={i}>
                    {/* <th>{i + 1}</th> */}
                    <td>{dato.name}</td>
                    {/* <td>{dato.movie}</td> */}
                    {/* <td>{dato.character}</td> */}
                    <td className="link link-info ">
                      <a href={dato.song_link} rel="noreferrer" target="_blank">
                        {/* {truncateText(dato.song_link, 25)} */}
                        <svg
                          viewBox="0 0 1024 1024"
                          fill="currentColor"
                          height="1em"
                          width="1em"
                          className="w-7 h-7 mx-auto"
                        >
                          <path d="M574 665.4a8.03 8.03 0 00-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8a8.03 8.03 0 00-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6a8.03 8.03 0 000 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6a8.03 8.03 0 000 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3a8.03 8.03 0 00-11.3 0L372.3 598.7a8.03 8.03 0 000 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z" />
                        </svg>
                      </a>
                    </td>
                    <th
                      onClick={() => {
                        setInfo({
                          ...dato,
                          person_data: JSON.parse(dato.person_data),
                        });
                        window.my_modal_2.showModal();
                      }}
                      className="badge badge-info mt-2 cursor-pointer hover:badge-secondary bg-cyan-500"
                    >
                      VER
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {data.length === 0 && !isLoading && (
          <div className="alert max-w-lg mx-auto  mt-3 alert-info">
            Nada por aqui....
          </div>
        )}
        {isLoading && (
          <div>
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Registers;
