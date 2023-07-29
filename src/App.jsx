import { useState } from "react";
import "./App.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import ReactFileReader from "react-file-reader";
import { Toaster, toast } from "react-hot-toast";
import { uploadFile } from "./firebase/config";
import { DetectFace } from "./FaceRecognition";
import Loader from "./Loader";
import Registers from "./Registers";
import { api } from "./api";
function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength) + "...";
}
function isAlphaWithSpaces(input) {
  const alphaWithSpacesRegex = /^[A-Za-z\s]+$/;
  return alphaWithSpacesRegex.test(input);
}
function App() {
  const [image, setImage] = useState(null);
  const [loader, setLoader] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [inputIndicator, setInputIndicator] = useState([]);
  const [page, setPage] = useState(1);
  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
  } = useForm();
  const sendData = async (data) => {
    let isValid = true;
    let values = [];
    Object.values(data).forEach((value, key) => {
      if (key <= 2) {
        const validation = isAlphaWithSpaces(value);
        if (validation === false) {
          isValid = false;
          values = [...values, key]; // Append the matching key to the array
        }
      }
    });
    setInputIndicator(values);
    console.log(values);

    if (isValid) {
      setLoader(true);
      let imageFireBase = null;
      const imageBase64Size =
        calculateTextSizeInBytes(image.base64) / (1024 * 1024);
      if (true)
        imageFireBase = await uploadFile(image.fileList[0]);
      const result = await uploadFile(videoFile);
      const faceResult = await DetectFace(imageFireBase );
      if (result) {
        if (faceResult) {
          axios
            .post(`${api}/form`, {
              ...data,
              image: imageFireBase ? imageFireBase : image.base64,
              video: result,
              person_data: faceResult,
            })
            .then((res) => {
              console.log(res);
              reset();
              setVideoFile(null);
              setImage(null);
              toast.success("Enviado con éxito");
            })
            .catch((err) => {
              console.log(err);
              toast.error("Hubó un error en el envio intenta otra vez ");
            })
            .finally(() => {
              setLoader(false);
              setTimeout(() => {
                setPage(0);
              }, 2500);
            });
        } else {
          setLoader(false);
          toast.error("No se detectó nigun rostro intenta con otra imagen");
        }
      } else {
        setLoader(false);
        toast.error("Elige un archivo de menor tamaño");
      }
    } else {
      toast.error("Rellena correctamente todos los campos");
    }
  };

  function calculateTextSizeInBytes(text) {
    const encoder = new TextEncoder();
    const textBytes = encoder.encode(text);
    return textBytes.length;
  }

  return (
    <>
      {page === 1 ? (
        <div className="text-center p-[2rem]">
          <Toaster />
          <div className="text-5xl mb-5 font-extrabold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
              Formulario Chido :D
            </span>
          </div>
          <div
            onClick={() => setPage(0)}
            className="text-center badge badge-success mb-5 p-3 italic cursor-pointer hover:badge-primary bg-cyan-500"
          >
            Ver datos
          </div>
          <form
            action=""
            className="pb-20"
            onSubmit={handleSubmit((data) => sendData(data))}
          >
            <div className="flex gap-3 flex-col justify-center items-center ">
              <input
                type="text"
                placeholder="Tu nombre"
                {...register("name", { required: true, maxLength: 100 })}
                className={`input input-bordered  input-success w-full max-w-xs ${
                  inputIndicator.includes(0) ? "input-error" : "input-success"
                }`}
              />
              <input
                type="text"
                {...register("movie", { required: true, maxLength: 100 })}
                placeholder="Tu película favorita"
                className={`input input-bordered ${
                  inputIndicator.includes(1) ? "input-error" : "input-success"
                }  w-full max-w-xs`}
              />{" "}
              <div id="video-reader">
                <ReactFileReader
                  fileTypes={[".webm", ".mp4", ".avi"]}
                  handleFiles={(e) => {
                    console.log(e[0].name);
                    setVideoFile(e[0]);
                  }}
                >
                  <div className="bg-gray-800   rounded-xl p-6">
                    <div>Sube un trailer de la pelicula</div>
                    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      height="1em"
      className="w-14 h-14 mx-auto"
      width="1em"
    >
      <path d="M16 7l4-4v14l-4-4v3a2 2 0 01-2 2H2a2 2 0 01-2-2V4c0-1.1.9-2 2-2h12a2 2 0 012 2v3zm-8 7a4 4 0 100-8 4 4 0 000 8zm0-2a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
                    <div className="badge badge-warning">
                      {videoFile && videoFile.name.length > 0
                        ? truncateText(videoFile.name, 20)
                        : "-"}
                    </div>

                    <div></div>
                  </div>
                </ReactFileReader>
              </div>
              <input
                type="text"
                {...register("character", { required: true, maxLength: 100 })}
                placeholder="Tu personaje favorito"
                className={`input input-bordered ${
                  inputIndicator.includes(2) ? "input-error" : "input-success"
                }  w-full max-w-xs`}
              />{" "}
              <div id="image-reader">
                <ReactFileReader
                  fileTypes={[".jpg", ".png", ".jpeg", "webp"]}
                  handleFiles={(event) => {
                    console.log(event.fileList[0].size / (1024 * 1024));
                    setImage(event);
                    !event.fileList[0] && alert(event);
                  }}
                  base64={true}
                >
                  <div className="flex flex-col bg-gray-800 rounded-lg p-4 items-center gap-2">
                    <div>Sube una imagen del personaje</div>
                    <div className="">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      height="1em"
                      width="1em"
                      className="w-20  h-20 mx-auto"
                    >
      <path d="M1 5h2v14H1V5m4 0h2v14H5V5m17 0H10a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1M11 17l2.5-3.15L15.29 16l2.5-3.22L21 17H11z" />
    </svg>
                    </div>
                    <div className="badge badge-warning">
                      {image &&
                      image.fileList[0] &&
                      image.fileList[0].name.length > 0
                        ? truncateText(image.fileList[0].name, 20)
                        : "-"}
                    </div>
                  </div>
                </ReactFileReader>
              </div>
              <input
                type="url"
                {...register("song_link", { required: true, maxLength: 2048 })}
                placeholder="Link a cancion"
                className="input input-bordered input-success w-full max-w-xs"
              />
              <div className="w-full">
                {loader ? (
                  <Loader />
                ) : (
                  <button
                    disabled={!videoFile || !image}
                    type="submit"
                    className="btn  w-48 btn-success"
                  >
                    Enviar
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      ) : (
        <Registers changeState={setPage} />
      )}
    </>
  );
}

export default App;
