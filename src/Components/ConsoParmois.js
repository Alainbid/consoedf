import React, { useEffect, useState, useRef } from "react";
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
  const lastMonthInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firstMonth, setFirstMonth] = useState('');
  const [lastMonth, setLastMonth] = useState('');
  const [dernierMois, setDernierMois] = useState('');
  const [premierMois, setPremierMois] = useState('');

  const firstAnnee  = new Date().getFullYear();
  var lastAnnee = new Date().getFullYear();
  const quelMois = new Date().getMonth();
  if(quelMois >= 0 && quelMois <= 4 ){
    lastAnnee = firstAnnee - 1;
  }


  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        var monthsToFetch = [];
        for (let i = firstMonth+1; i <= lastMonth +1; i++) {
          monthsToFetch.push(i);
        }

        const allData = [];
        for (const mois of monthsToFetch) {
          const debut = new Date(`${firstAnnee}-${mois - 1}-01`).getTime();
          const fin = new Date(`${lastAnnee}-${mois}-01`).getTime();

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
            allData.push({ mois, data });
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
  }, [lastAnnee, firstMonth, lastMonth, firstAnnee]);

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
    if ((value >= 1 && value <= 5) || value > 12) {
      setFirstMonth(6);
      setPremierMois  (6);
    } else {
      setFirstMonth(value);
    }
    lastMonthInputRef.current.focus();  // Call verifierLastMonth when Enter is pressed
  };

  const verifierLastMonth = (value) => {
  if((value < firstMonth && firstAnnee === lastAnnee )|| value > 12){
      alert("Le mois de fin doit être supérieur au mois de début et inférieur à 12");
      setLastMonth(12)
      setDernierMois(12);
    }else{
      setLastMonth(value);
    }
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

          {firstMonth > 0 && lastMonth > 0 && (
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
                            Total {monthTag[mois - 2]} = {grandTotal.toFixed(2)} €
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
