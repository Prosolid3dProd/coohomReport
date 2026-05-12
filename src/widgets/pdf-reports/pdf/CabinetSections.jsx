import { Text, View, Image } from "@react-pdf/renderer";
import { CONFIG } from "../../../shared/config";
import { formatNumber } from "../../../shared/lib/calculations";
import { grayscaleFilter, loadImage, verificarVariable } from "./pdfUtils";

const SectionHeader = ({ title, price }) => (
  <View style={{ marginTop: 10 }} wrap={false}>
    <Text style={{ fontSize: "14", marginLeft: "32" }}>{title}</Text>
    <View style={{ display: "flex", flexDirection: "row", fontFamily: CONFIG.BOLD, marginTop: "12", fontSize: "10", padding: "2", backgroundColor: "#CFCFCF", borderBottom: "1 black solid" }}>
      <View><Text style={{ width: "50" }}>POS</Text></View>
      <View><Text style={{ width: "100" }}>MUEBLE</Text></View>
      <View><Text style={{ width: "40" }}>UD.</Text></View>
      <View><Text style={{ width: "300" }}>DESCRIPCION</Text></View>
      {price && <View><Text style={{ width: "70" }}>IMPORTE</Text></View>}
    </View>
  </View>
);

const VariantesRow = ({ item }) => {
  if (formatNumber(item.priceVariants) <= 0) return null;
  return (
    <View style={{ display: "flex", flexDirection: "column" }}>
      <Text>Variantes: </Text>
      {item.variants.map((it, i) => (
        <Text key={i}>{`${it.name}: ${String(it.description).includes("$") ? it.value : it.description || it.nameValue}${it.mcv ? "/" + it.mcv : ""}`}</Text>
      ))}
    </View>
  );
};

const ObservacionRow = ({ item }) => {
  if (!item?.observation || item.observation.length === 0) return null;
  return <Text style={{ fontFamily: CONFIG.BOLD, fontSize: 8 }}>Observaciones: {item.observation}</Text>;
};

const ItemBase = ({ pos, item, price, children }) => (
  <View style={{ display: "flex", flexDirection: "row", marginTop: "1" }} wrap={false}>
    <View style={{ width: "50", fontSize: "8" }}><Text>{pos}</Text></View>
    <View style={{ height: "100", width: "100", fontSize: "8" }}>
      <Text><Image style={{ width: "80", height: "80" }} filter={grayscaleFilter} src={loadImage(item.obsBrandGoodId || item.obsBrandGoodId2)} /></Text>
    </View>
    <View style={{ width: "40", fontSize: "11" }}><Text style={{ fontSize: "8" }}>{item.quantity || 1}</Text></View>
    <View style={{ width: "300", fontSize: "8" }}>{children}</View>
    {price && (
      <View style={{ width: "70" }}>
        <Text style={{ fontSize: "8", textAlign: "right" }}>{parseFloat(item.total).toFixed(2)}</Text>
      </View>
    )}
  </View>
);

const BajoMuralAltoContent = ({ item, coeficiente }) => (
  <View>
    <Text style={{ fontFamily: CONFIG.BOLD }}>{item.reference}</Text>
    <Text style={{ fontFamily: CONFIG.BOLD }}>{item.name}</Text>
    <Text style={{ fontSize: "8" }}>L: {item.size?.x} F: {item.size?.y} A: {item.size?.z}</Text>
    {item.opening && <Text style={{ fontSize: "8" }}>M: {item?.opening}</Text>}
    {formatNumber(item.priceDrawers, coeficiente) > 0 && (
      <Text>- Frente:{item.drawerMaterialDetails?.length > 0 && item.drawerPriceDetails?.length > 0 && (
        <View><Text style={{ fontSize: 7 }}>{item.drawerPriceDetails.map((it, i) => {
          const md = item.drawerMaterialDetails[i];
          if (!md || it === 0) return null;
          return `${md.modelo ? md.modelo + "-" : ""}${md.Acabado || ""}/ `;
        })}</Text></View>
      )}</Text>
    )}
    {item.doors?.acabadoTirador !== undefined && item.doors.acabadoTirador !== "" && (
      <Text>- Tiradores: {`${item.doors.acabadoTirador}/ `}</Text>
    )}
    {item.drawerMaterialDetails?.length > 0 && item.drawerMaterialDetails.some((md) => md?.acabadoTirador?.trim() !== "") && (
      <Text>- Tiradores:{item.drawerMaterialDetails.map((md) => md?.acabadoTirador?.trim() ? `${md.acabadoTirador} / ` : "")}</Text>
    )}
    {formatNumber(item.priceDoor, coeficiente) > 0 && (
      <Text>- Puertas:<Text style={{ fontFamily: CONFIG.BOLD, fontSize: "8" }} />{`${item.doors.name?.toLocaleUpperCase()}-${item.doors.material}`}</Text>
    )}
    {formatNumber(item.priceCabinet, coeficiente) > 0 && (
      <Text>- Armazon:<Text style={{ fontSize: "8" }}>{item.material || item.materialCabinet}</Text></Text>
    )}
    <VariantesRow item={{ ...item, priceVariants: formatNumber(item.priceVariants, coeficiente) > 0 ? item.priceVariants : 0 }} />
    <ObservacionRow item={item} />
  </View>
);

const VARIANT_ORDER = ["PVA", "PVL", "ANCHO PUERTA", "PIES", "VUELO IZQUIERDO", "VUELO DERECHO"];

const CabinetSections = ({ cabinets, price, coeficiente = 1, complementos }) => {
  let contador = 1;

  const mainSections = [
    { key: "bajos", title: "MUEBLES BAJOS", renderContent: (item) => <BajoMuralAltoContent item={item} coeficiente={coeficiente} /> },
    { key: "murales", title: "MUEBLES MURALES", renderContent: (item) => <BajoMuralAltoContent item={item} coeficiente={coeficiente} /> },
    { key: "altos", title: "MUEBLES ALTOS", renderContent: (item) => <BajoMuralAltoContent item={item} coeficiente={coeficiente} /> },
    {
      key: "regletas", title: "MUEBLES REGLETAS", renderContent: (item) => (
        <View>
          <Text style={{ fontFamily: CONFIG.BOLD }}>{item.reference}</Text>
          <Text style={{ fontFamily: CONFIG.BOLD }}>{item.name}</Text>
          <Text style={{ fontSize: "8" }}>L:{item.name.toLocaleUpperCase().includes("REGLETA") ? 150 : item.size.x} F: {item.size?.y} A: {item.size?.z}</Text>
          {item.opening && <Text style={{ fontSize: "8" }}>M: {item?.opening}</Text>}
          <Text>- Frente: {item.materialRegletaF}</Text>
          {formatNumber(item.priceCabinet, coeficiente) >= 0 && !item.name.includes("Puerta") && !item.name.includes("Frente") && (
            <Text>- Armazon:<Text style={{ fontSize: "8" }}>{item.materialRegleta}</Text></Text>
          )}
          <VariantesRow item={item} />
          <ObservacionRow item={item} />
        </View>
      ),
    },
    {
      key: "costados", title: "COSTADOS", renderContent: (item) => (
        <View>
          <Text style={{ fontFamily: CONFIG.BOLD }}>{item.reference}</Text>
          <Text style={{ fontFamily: CONFIG.BOLD }}>{item.name}</Text>
          <Text style={{ fontSize: "8" }}>L: {item.size?.x} F: {item.size?.y} A: {item.size?.z}</Text>
          {item.opening && <Text style={{ fontSize: "8" }}>M: {item?.opening}</Text>}
          {formatNumber(item.priceDoor, coeficiente) > 0 && (
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text>- Puertas: </Text>
              <Text style={{ fontSize: "8" }}>{item.modelDoor || ""} {item.modelDoor ? "/" : " "}{item.materialDoor || ""}</Text>
            </View>
          )}
          {formatNumber(item.priceCabinet, coeficiente) > 0 && (
            <Text>- Acabado:<Text style={{ fontSize: "8" }}>{item.materialCostado || "No hay acabado"}</Text></Text>
          )}
          <VariantesRow item={item} />
          <ObservacionRow item={item} />
        </View>
      ),
    },
    {
      key: "decorativos", title: "DECORATIVOS", renderContent: (item) => (
        <View>
          <Text style={{ fontFamily: CONFIG.BOLD }}>{item.reference}</Text>
          <Text style={{ fontFamily: CONFIG.BOLD }}>{item.name}</Text>
          <Text style={{ fontSize: "8" }}>L: {item.size?.x} F: {item.size?.y} A: {item.size?.z}</Text>
          {item.opening && <Text style={{ fontSize: "8" }}>M: {item?.opening}</Text>}
          {formatNumber(item.priceDoor, coeficiente) > 0 && (
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text>- Puertas: </Text>
              <Text style={{ fontFamily: CONFIG.BOLD, fontSize: "8" }}>{item.modelDoor || ""} {item.modelDoor ? "/" : " "}{item.materialDoor || ""}</Text>
            </View>
          )}
          {formatNumber(item.priceCabinet, coeficiente) > 0 && (
            <Text>
              {item.materialCabinetMP && <>- Armazon:<Text style={{ fontSize: "8" }}>{item.materialCabinetMP}</Text>{"\n"}</>}
              {item.materialCabinetAcab && <>- Acabado:<Text style={{ fontSize: "8" }}>{item.materialCabinetAcab}</Text>{"\n"}</>}
              {!item.materialCabinetMP && !item.materialCabinetAcab && item.material && <>- Acabado:<Text style={{ fontSize: "8" }}>{item.material}</Text></>}
            </Text>
          )}
          {formatNumber(item.priceVariants, coeficiente) > 0 && (
            <View style={{ display: "flex", flexDirection: "column" }}>
              <Text>Variantes: </Text>
              {item.variants.sort((a, b) => {
                const iA = VARIANT_ORDER.indexOf(String(a.name).toUpperCase());
                const iB = VARIANT_ORDER.indexOf(String(b.name).toUpperCase());
                return (iA !== -1 ? iA : VARIANT_ORDER.length) - (iB !== -1 ? iB : VARIANT_ORDER.length);
              }).map((it) => (
                <Text key={it.name}>{it.name}:{String(it.description).includes("$") ? it.value : it.description || it.nameValue}{it.mcv ? "/" + it.mcv : ""}</Text>
              ))}
            </View>
          )}
          <ObservacionRow item={item} />
        </View>
      ),
    },
  ];

  return (
    <>
      {mainSections.map(({ key, title, renderContent }) =>
        cabinets?.[key]?.length > 0 ? (
          <View key={key} style={{ marginTop: 10 }}>
            <SectionHeader title={title} price={price} />
            {cabinets[key].map((item, i) => (
              <ItemBase key={i} pos={contador++} item={item} price={price}>
                {renderContent(item)}
              </ItemBase>
            ))}
          </View>
        ) : null
      )}

      <View style={{ marginTop: 40 }}>
        {complementos && (
          <View wrap={false}>
            <Text style={{ fontSize: "14", marginLeft: "32", marginTop: 20 }}>COMPLEMENTOS</Text>
            <View style={{ display: "flex", flexDirection: "row", fontFamily: CONFIG.BOLD, marginTop: "12", fontSize: "10", padding: "2", backgroundColor: "#CFCFCF", borderBottom: "1 black solid" }}>
              <View><Text style={{ width: "50" }}>POS</Text></View>
              <View><Text style={{ width: "100" }}>MUEBLE</Text></View>
              <View><Text style={{ width: "40" }}>UD.</Text></View>
              <View><Text style={{ width: "300" }}>DESCRIPCION</Text></View>
              {price && <View><Text style={{ width: "70" }}>IMPORTE</Text></View>}
            </View>
          </View>
        )}
        {cabinets?.complementos?.length > 0 && cabinets.complementos.map((item, i) => (
          <ItemBase key={i} pos={contador++} item={item} price={price}>
            <View>
              <Text style={{ fontFamily: CONFIG.BOLD }}>{item.reference}</Text>
              <Text style={{ fontFamily: CONFIG.BOLD }}>{item.name}</Text>
              <Text style={{ fontSize: "8" }}>L: {item.size?.x} F: {item.size?.y} A: {item.size?.z}</Text>
              {item.opening && <Text style={{ fontSize: "8" }}>M: {item?.opening}</Text>}
              <Text>- Acabado:<Text style={{ fontSize: "8" }}>{verificarVariable(item.material)}</Text></Text>
              <VariantesRow item={item} />
              <ObservacionRow item={item} />
            </View>
          </ItemBase>
        ))}
      </View>

      {cabinets?.accesorios?.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <SectionHeader title="ACCESORIOS" price={price} />
          {cabinets.accesorios.map((item, i) => (
            <ItemBase key={i} pos={contador++} item={item} price={price}>
              <View>
                <Text style={{ fontFamily: CONFIG.BOLD }}>{item.reference}</Text>
                <Text style={{ fontFamily: CONFIG.BOLD }}>{item.name}</Text>
                <Text style={{ fontSize: "8" }}>L: {item.size?.x} F: {item.size?.y} A: {item.size?.z}</Text>
                {formatNumber(item.priceCabinet, coeficiente) > 0 && (
                  <Text>- Acabado:<Text style={{ fontSize: "8" }}>{item.material}</Text></Text>
                )}
                {item.opening && <Text style={{ fontSize: "8" }}>M: {item?.opening}</Text>}
                <VariantesRow item={item} />
                <ObservacionRow item={item} />
              </View>
            </ItemBase>
          ))}
        </View>
      )}
    </>
  );
};

export default CabinetSections;
