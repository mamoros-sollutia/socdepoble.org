import React from "react";
import { UniversalPage } from "../../../components/universal/UniversalPage";

export default function GestoriaInformes() {
  return (
    <UniversalPage chrome="system"
      title="Informes"
      labels={["GESTORIA", "PANEL INTERN"]}
    >
      <div className="content-wrapper">
        <h2>Secció en construcció</h2>
        <p>Aquesta és la nova vista nativa per a GestoriaInformes.</p>
      </div>
    </UniversalPage>
  );
}
