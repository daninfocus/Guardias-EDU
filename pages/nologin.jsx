import React, { useState, useContext, useEffect } from "react";
import Nav from "../components/Nav";
import GuardiasContext from "../context/GuardiasContext";
import AuthCheck from "../components/auth/AuthCheck";
import { addDocument, getNoLoginUrl, getNoLoginUrlByUrl } from "../firebase/firestore";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

const NoLogin = () => {
    const [url, setUrl] = useState("");
    const [hasUrl, setHasUrl] = useState(false);
    const [savedUrl, setSavedUrl] = useState(null);
    const { college } = useContext(GuardiasContext);

    const saveUrl = async () => {
        if (url) {
            if (!hasUrl) {
                let existingUrls = await getNoLoginUrlByUrl(url);
                if(existingUrls.length==0){
                    addDocument("no-login-url", {
                        url: url,
                        collegeId: college.id,
                    }).then((id) => {
                        setSavedUrl(url);
                        toast.success("Url guardado", {
                            icon: "✅",
                        });
                    });

                    setHasUrl(true);
                }else{
                    alert("Esa url ya existe");
                }
            } else {
                alert("Solo puedes tener 1 url");
            }
        } else {
            alert("Introduce una url");
        }
    };

    const getData = async () => {
        if (college && college.id) {
            let urlsObj = await getNoLoginUrl(college.id);
            if (urlsObj[0]) {
                setSavedUrl(urlsObj[0].data().url);
                setHasUrl(true);
            }
        }
    };

    useEffect(() => {
        getData();
    }, [college]);

    return (
        <AuthCheck>
            <Toaster
                position="bottom-center"
                toastOptions={{
                // Define default options
                duration: 5000,
                style: {
                    background: "#363636",
                    color: "#fff",
                },
                }}
            />
            <title>{"Conf. Pantalla sin logueo"}</title>
            <div className="h-screen bg-gray-200 w-full">
                <Nav simpleNav={true} />
                <div className="mt-5 m-auto md:w-1/2 h-auto text-left rounded-xl shadow-2xl p-5 bg-gray-100">
                    <div>
                        Introduce la <strong>url</strong> con la cual accederá al calendario
                        de su centro sin necesidad autenticación.
                    </div>
                    <input
                        className="text-sm w-full h-full border-2 rounded-xl p-2"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    ></input>
                    <div className="w-full justify-end flex p-2 items-center ">
                        <button
                            onClick={() => saveUrl()}
                            className="px-4 py-2 right-0 whitespace-nowrap items-center rounded-xl  hover:bg-emerald-600 hover:shadow-md transition-all cursor-pointer hover:translate-y-1 bg-emerald-500 text-white  font-semibold flex flex-row justify-between text-xs mb-1"
                        >
                            Guardar URL
                        </button>
                    </div>
                    {typeof window !== "undefined"&&<a target="_blank" rel="noreferrer" href={`${window.location.protocol + '//' +window.location.host+window.location.pathname}/${savedUrl?savedUrl:url}`} className={savedUrl?"text-emerald-600 font-semibold":""}>{window.location.protocol + '//' +window.location.host+window.location.pathname}/{savedUrl?savedUrl:url}</a>}
                    
                </div>
            </div>
        </AuthCheck>
    );
};

export default NoLogin;
