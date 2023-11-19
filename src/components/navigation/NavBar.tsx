import React, {useCallback, useRef, useState} from 'react';
import Modal from "@/components/Modal";
import Login from "@/components/auth/Login";
import {getSession, signOut, useSession} from "next-auth/react";
import {FaPeriscope, FaSearchLocation, FaUserCircle} from "react-icons/fa";
import LoginModalContent from "@/components/auth/LoginModaContent";
import {getServerSession} from "next-auth";

// @ts-ignore
import {authOptions} from "../../../pages/api/auth/[...nextauth]";
import {Button, Form, Input, Space, AutoComplete} from "antd";
import Search from "antd/es/input/Search";
import {BiLocationPlus, BiPlusCircle} from "react-icons/bi";
import debounce from 'lodash/debounce';



export default function NavBar({setFeature}: { setFeature?: (feature?: any) => void }) {
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [options, setOptions] = useState([]);
    const {data: session} = useSession()
    console.log(session)

    const handleClose = () => {
        setShowModal(false)
    }


    const debouncedSearchLocation = useCallback(
        debounce((query) => searchLocation(query), 1000),
        [] // Les dépendances vides signifient que cette fonction n'est créée qu'une seule fois
    );

    const transformData = (data:any) => {
        const uniqueOptions = new Map(); // Utiliser une Map pour garder une trace des options uniques

        data.features.forEach((feature:any) => {
            const name = feature.properties.name;
            const state = feature.properties.state;
            const country = feature.properties.country;
            const key = `${name}, ${state}, ${country}`; // Clé unique pour chaque option

            if (!uniqueOptions.has(key)) { // Vérifier si l'option est déjà présente
                uniqueOptions.set(key, {
                    value: key,
                    //render label with image
                    label: (<div>{key}</div>),
                    feature: feature
                });
            }
        });

        return Array.from(uniqueOptions.values()); // Convertir les valeurs de la Map en tableau
    };
     const searchLocation = (query : string) => {
        setLoading(true)
        setOptions([])
        var photonUrl = 'https://photon.komoot.io/api/?q=' + encodeURIComponent(query);

        fetch(photonUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.features && data.features.length > 0) {
                    // @ts-ignore
                    setOptions(transformData(data));

                    // map.setView([firstResult.geometry.coordinates[1], firstResult.geometry.coordinates[0]], 13);
                } else {
                    alert('Aucun résultat trouvé');
                }
                setLoading(false)
            })
            .catch(error => {
                console.error('Erreur lors de la recherche :', error);
                alert('Erreur lors de la recherche');
                setLoading(false)
            });
    }

    const userDropDown = () => {
        return (
            <div className="flex justify-end flex-1 px-2">
                <div className="flex items-center gap-4">
                    <button className=" rounded-btn transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110  duration-300"><BiLocationPlus  size={30} /></button>
                    <div className="dropdown dropdown-bottom dropdown-end">
                        <button><FaUserCircle tabIndex={0} size={30}/></button>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a>profile</a></li>
                            <li>
                                <button onClick={() => {
                                    signOut().then(r => console.log(r))
                                }}>sign out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    const handleSelect = (value: any, option:any) => {
        // Récupérer et transmettre l'objet feature complet
       if(setFeature) setFeature(option.feature);
    };

    return (

        <div className="h-2/6 navbar bg-base-100 z-40 shadow-lg">
            <Modal showModal={showModal} content={<LoginModalContent closeModal={handleClose}/>} handleClose={handleClose}/>
            <div className="navbar-start">
                <div className="p-2 pl-5 pr-5 flex-1">
                    <a href={'/'} className="text-xl text-black">
                        <img className="max-h-12 " src={'/assets/image/Midgard.png'} alt={'logo midgard'}/>
                    </a>
                </div>
            </div>
            <div className="navbar-center w-2/5">
                <Space.Compact className="rounded-full w-full">
                    <AutoComplete
                        onSelect={handleSelect}
                        options={options}
                        autoClearSearchValue
                        backfill
                        popupClassName={'w-full'}
                        onSearch={(e)=>{
                        setLoading(true)
                         setOptions([])
                        debouncedSearchLocation(e)
                    }}
                        allowClear
                        placeholder="City, object etc"
                        className="input-bordered w-full rounded-full"
                        />
                    <Button icon={<FaSearchLocation />} loading={loading} className="rounded-full">
                    </Button>
                </Space.Compact>
            </div>
            <div className="navbar-end">
                <ul className="flex text-black">
                    <li className="mr-6">
                        {session ? userDropDown() : <button onClick={() => setShowModal(!showModal)}>Log in</button>}
                    </li>
                </ul>
            </div>
        </div>
    )
}