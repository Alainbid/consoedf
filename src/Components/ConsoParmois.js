import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../FirebaseFirestore.jsx";
import "../styles/consomois.scss";

const ConsoParmois = () => {
  const prix = {
    hpbleu: 0.161,
    hcbleu: 0.129,
    hpblanc: 0.189,
    hcblanc: 0.148,
    hprouge: 0.756,
    hcrouge: 0.157,
  };
  const monthTag = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Aout",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const annee = 2024;

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const monthsToFetch = [5,6,7,8,9,10,11,12]; // Fetch for June up to novembre
        const allData = [];
        //on execute le query pour tous les mois sélectionnés
        for (const mois of monthsToFetch) {
          const debut = new Date(`${annee}-${mois - 1}-01`).getTime();
          const fin = new Date(`${annee}-${mois}-01`).getTime();

          const collectionRef = collection(db, "edf");
          const lequery = query(
            collectionRef,
            where("date", ">=", debut),
            where("date", "<=", fin),
            orderBy("date", "asc")
          );

          const querySnapshot = await getDocs(lequery);
          const data = querySnapshot.docs.map((doc) => doc.data());
          // à chaque mois on ajoute les datas du mois dans array alldata
          allData.push({ mois, data });
          console.log("alldata", allData)
        }
        // fin boucle for


        setMonthlyData(allData); // Update state with data for all months
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données Firestore: ", error);
        setIsLoading(false);
      }
    };

    fetchMonthlyData();
  }, [annee]);


  var calculateTotals = (data) => {
    // si on n'a qu'un data on arrête
    if (data.length < 2) return { subtotals: [], grandTotal: 0 };

    const first = data[0];
    const last = data[data.length - 1];
    let grandTotal = 0;
    //calcul du prix pour chaque data
    const subtotals = Object.keys(prix).map((key) => {
      const total = ((last[key] || 0) - (first[key] || 0)) * prix[key];
      grandTotal += total;
      return { key, total };
    });

    return { subtotals, grandTotal };
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="titre">Cout EDF par mois</h2>
      {monthlyData.length > 0 ? (
        monthlyData.map(({ mois, data }) => {
          const { subtotals, grandTotal } = calculateTotals(data);

          return (
            <div key={mois}>
            
              {data.length > 0 ? (
                <ul>
                  {data.map((item, index) => (
                    <ul className="ligne1" key={index}>
                      {new Date(item.date).toLocaleDateString()} {" "}
                      {Object.keys(prix).map((key) => (
                        <span key={key}>
                          {key} = {item[key] || "N/A"} {" "}
                        </span> 
                      ))}
                    </ul>
                  ))}
                </ul>
              ) : (
                <p>Aucune donnée disponible pour ce mois.</p>
              )}
              {subtotals.length > 0 && (
                <>
                  {subtotals.map(({ key, total }) => (
                    <li className="ligne" key={key}>
                      Total {key} = {total.toFixed(2)} €
                    </li>
                  ))}
                  <strong className="ligne"> Total {monthTag[mois - 2]} = {grandTotal.toFixed(2)} €</strong>
                </>
              )}
            </div>
          );
        })
      ) : (
        <p>Aucune donnée disponible</p>
      )}
    </div>
  );
};

export default ConsoParmois;
