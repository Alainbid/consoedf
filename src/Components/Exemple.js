import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
} from "firebase/firestore";
import { db } from "../FirebaseFirestore.jsx";
import "../styles/consomois.scss";

const ConsoParmois = () => {
  const prix = {
    //on a modifié la structure de la table des prix
    // ce qui va permettre de les mapper avec les datas
    hpbleu: 0.161,
    hcbleu: 0.129,
    hpblanc: 0.189,
    hcblanc: 0.148,
    hprouge: 0.756,
    hcrouge: 0.157,
  };

  const [liste, setListe] = useState([]);

  const collectionRef = collection(db, "edf");

  const annee = new Date().getFullYear();
  const debut = new Date(`${annee}-07-01`).getTime();
  const fin = new Date(`${annee}-08-01`).getTime();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lequery = query(
          collectionRef,
          where("date", ">=", debut),
          where("date", "<=", fin),
          orderBy("date", "asc"),
          limit(66)
        );

        const querySnapshot = await getDocs(lequery);
        const data = querySnapshot.docs.map((doc) => doc.data());

        console.log("Données récupérées: ", data);
        setListe(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données Firestore: ", error);
      }
    };

    fetchData();
  }, []);

  const calculateTotals = () => {
    if (liste.length < 2) return { subtotals: [], grandTotal: 0 };

    const first = liste[0];
    const last = liste[liste.length - 1];
    let grandTotal = 0;

    // Calculate subtotals dynamically
    const subtotals = Object.keys(prix).map((key) => {
        //subtotals est un objet ayant pour cle keysde prix (hcbleu, hpbleu...)
        //pour chaque valeur de data on fait correspondre le prix ayant la même clé
      const total = ((last[key] || 0) - (first[key] || 0)) * prix[key];
      grandTotal += total; // Accumulate grand total
      return { key, total };//on retourne un tableau des couts pour chaque  clé : key
    });

    return { subtotals, grandTotal };// reourne  tous les sous-totaux et grand total
  };

  const { subtotals, grandTotal } = calculateTotals();

  return (
    <div>
      <h2 className="titre">Cout EDF par mois</h2>
      <ul>
        {liste.length > 0 ? (
          liste.map((item, index) => (
            <li key={index}>
              {new Date(item.date).toLocaleDateString()} {" "}
              {Object.keys(prix).map((key) => (
                <span key={key}>
                  {key} = {item[key] || "N/A"} {" "}
                </span>
              ))}
            </li>
          ))
        ) : (
          <li>Aucune donnée disponible</li>
        )}
        {subtotals.length > 0 && (
          <>
            {subtotals.map(({ key, total }) => (
              <li key={key}>
                Total {key} = {total.toFixed(2)} €
              </li>
            ))}
            <li>
              <strong>Grand Total = {grandTotal.toFixed(2)} €</strong>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default ConsoParmois;
