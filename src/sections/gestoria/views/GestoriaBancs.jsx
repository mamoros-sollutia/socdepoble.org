import React from "react";
import { UniversalPage } from "../../../components/universal/UniversalPage";

export default function GestoriaBancs() {
  return (
    <UniversalPage chrome="system"
      title="Bancs"
      labels={["GESTORIA", "PANEL INTERN"]}
    >
      <div className="content-wrapper">
        <h2>Secció en construcció</h2>
        <p>Aquesta és la nova vista nativa per a GestoriaBancs.</p>
      </div>
    </UniversalPage>
  );
}
