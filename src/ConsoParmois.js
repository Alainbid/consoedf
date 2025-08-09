import React, { useEffect, useState, useRef, useMemo } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "./FirebaseFirestore.jsx";
import "./styles/consoParmois.scss";

//console.log("db :", db);
const ConsoParmois = () => {
  // Prix en euros par kWh pour chaque type de consommation au 1/8/25
  const prix = {
    hcbleu: 0.1232,
    hpbleu: 0.1494,
    hcblanc: 0.1391,
    hpblanc: 0.1730,
    hcrouge: 0.1460,
    hprouge: 0.6468,
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
  const lastMonthInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [premierMois, setPremierMois] = useState();
  const [dernierMois, setDernierMois] = useState();
  

  var anneeActuelle  = new Date().getFullYear();
  const moisActuel = new Date().getMonth();
  var anneeDernière = anneeActuelle;

  var surDeuxAns = false;
  //si le mois actuel est compris entre 0 et 4, on décrémente l'année de 1
  if(moisActuel >= 0 && moisActuel <= 4 && dernierMois < premierMois ){
    surDeuxAns = true;
    anneeDernière = anneeActuelle - 1; //la dernière année est l'année précédante
  }else{surDeuxAns = false; anneeActuelle--;anneeDernière--;} 

  console.log("moisActuel", moisActuel);
  console.log("anneeDernière", anneeDernière);
  console.log("anneeActuelle", anneeActuelle);

const monthsToFetch = useMemo(() => {
      let lesMois;
      const months = [];
      let currentMonth = premierMois;

      console.log("surDeuxAns", surDeuxAns);
      if (surDeuxAns) {
        while (
          anneeActuelle > anneeDernière ||
          (anneeActuelle === anneeDernière && currentMonth <= dernierMois)
        ) {
          lesMois = { mois: currentMonth, an: anneeDernière };
          months.push(lesMois);
          currentMonth++;

          if (currentMonth > 2) {
            currentMonth = 0;
            anneeDernière++;
            if (anneeActuelle === anneeDernière && currentMonth > dernierMois) {
              break;
            }
          }
        }
      } else {
        while (currentMonth <= dernierMois) {
          lesMois = { mois: currentMonth, an: anneeDernière };
          months.push(lesMois);
          currentMonth++;

          if (currentMonth > 12) {
            break;
          }
        }
      }
      console.log("monthsToFetch", months);
      lesMois = null; // reset lesMois after use
      return months;
}, [premierMois, dernierMois, surDeuxAns, anneeActuelle, anneeDernière]);

   useEffect(() => {

    const fetchMonthlyData = async () => {

      try {
       
        const allData = [];

            for (const moisObj of monthsToFetch) {
              
              const debut = new Date(`${moisObj.an}-${moisObj.mois }-01`).getTime();
              const fin = new Date(moisObj.mois === 12 ? `${moisObj.an + 1}-01-01` : `${moisObj.an}-${moisObj.mois + 1}-01`).getTime() - 1;
              console.log("debut", debut);

              console.log("fin", fin);
              const collectionRef = collection(db, "edf");
              const lequery = query(
                collectionRef,
                where("date", ">=", debut),
                where("date", "<=", fin),
                orderBy("date", "asc")
              );

              if(monthsToFetch.length > 1) {
                console.log("monthsToFetch", monthsToFetch);
                const querySnapshot = await getDocs(lequery);
                const data = querySnapshot.docs.map((doc) => doc.data());
                allData.push({ mois: moisObj.mois, data });
                console.log("allData", allData);
              }
            }
      

        setMonthlyData(allData);
        setIsLoading(false);
      } 
      catch (error) {
        console.error("Erreur lors de la récupération des données Firestore: ", error);
        setIsLoading(false);
      }
    };

    fetchMonthlyData();
   }, [dernierMois, premierMois, monthsToFetch]);




  const calculateTotals = (data) => {
    if (data.length < 2) return { subtotals: [], grandTotal: 0 };

    const first = data[0];
    const last = data[data.length - 1];
    let grandTotal = 0;

    const subtotals = Object.keys(prix).map((key) => {
      const total = ((last[key] || 0) - (first[key] || 0)) * prix[key];
      grandTotal += total;
      return { key, total };
    });

    return { subtotals, grandTotal };
  };

  const verifierFirstMonth = (value) => {
    // on vérifie si le mois de début est compris entre 1 et 5 ou supérieur à 12
    if ((value >= 1 && value <= 5) ) {
      //setFirstMonth(5);
      setPremierMois  (5);
    } else {
      setPremierMois(value);
    }
    console.log("premier Mois", premierMois);
    lastMonthInputRef.current.focus();  // Call verifierLastMonth when Enter is pressed
  };

  const verifierLastMonth = (value) => {
  if((!surDeuxAns)){
      alert("Le mois de fin doit être supérieur au mois de début et inférieur à 12");
      setDernierMois(12);
    }else{
      setDernierMois(value);
    }
    console.log("dernier Mois", dernierMois);
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h2 className="titre">Cout EDF par mois</h2>
          <form style={{ display: "flex", justifyContent: "center", width:"186px",marginLeft:"282px", paddingBottom:"10px"}}>
         <div>
            <label >Mois début</label>
            <input    
              style={{width:"50px"}}
              type="number"
              value={premierMois}
              onChange={(e) => setPremierMois(e.target.value)} // Assuming you have a state setter for lastMonth
              onKeyDown={(e) => {
              if (e.key === "Enter") {
                verifierFirstMonth(Number(e.target.value));
                
              }
            }}
            />   
          </div>
          <div>
          <label>Mois fin</label>
          <input
            ref={lastMonthInputRef}
            style={{ width: "50px", marginBottom: "8px" }}
            type="number"
            value={dernierMois}
            onChange={(e) => setDernierMois(e.target.value)} // Assuming you have a state setter for lastMonth
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                verifierLastMonth(Number(e.target.value)); // Call verifierLastMonth when Enter is pressed
              }
            }}
          />
</div>
          </form>

          {premierMois > 0 && dernierMois > 0 && (
            <div>
              {monthlyData.length > 0 ? (
                monthlyData.map(({ mois, data }) => {
                  const { subtotals, grandTotal } = calculateTotals(data);

                  return (
                    <div key={mois}>
                      {data.length > 0 ? (
                        <ul>
                          {data.map((item, index) => (
                            <ul className="ligne1" key={index}>
                              {new Date(item.date).toLocaleDateString()}{" "}
                              {Object.keys(prix).map((key) => (
                                <span key={key}>
                                  {key} = {item[key] || "N/A"}{" "}
                                </span>
                              ))}
                            </ul>
                          ))}
                        </ul>
                      ) : (
                        <p>Recherche des données disponibles...</p>
                      )}
                      {subtotals.length > 0 && (
                        <>
                          {subtotals.map(({ key, total }) => (
                            <li className="ligne" key={key}>
                              Total {key} = {total.toFixed(2)} €
                            </li>
                          ))}
                          <strong className="ligne">
                            Total {monthTag[mois - 1]} = {grandTotal.toFixed(2)} €
                          </strong>
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>Recherche des données disponibles...</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
 };

export default ConsoParmois;
