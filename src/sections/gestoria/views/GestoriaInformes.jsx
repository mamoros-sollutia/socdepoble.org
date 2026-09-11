import React from "react";
import { UniversalPage } from "../../../components/universal/UniversalPage";

export default function GestoriaInformes() {
  return (
    <UniversalPage
      title="Informes"
      category="GESTORIA"
      tags={["PANEL INTERN"]}
    >
      <div className="up-document">
        <h2>Secció en construcció</h2>
        <p>Aquesta és la nova vista nativa per a GestoriaInformes.</p>
      </div>
    </UniversalPage>
  );
}
