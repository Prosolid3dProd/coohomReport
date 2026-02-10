import React from "react";
import { Text, View, Image } from "@react-pdf/renderer";
import { CONFIG } from "../../data/constants";
import { formatNumber } from "../../utils/operaciones";
import solaImagenes from "../../data/solaImages.json";

const CabinetTable = ({
    items,
    title,
    price,
    contador,
    coeficiente = 1,
    showObservations = true,
}) => {
    if (!items || items.length === 0) return null;

    const getMaterialName = (material) => {
        if (typeof material === "string") return material;
        if (typeof material === "object" && material !== null) {
            return material.materialCabinet || null;
        }
        return null;
    };

    const grayscaleFilter = (color) => {
        const r = Math.floor(0.299 * color.r + 0.587 * color.g + 0.114 * color.b);
        return { r, g: r, b: r };
    };

    const loadImage = (serial) => {
        const xxx = solaImagenes.find((item) => item.serial === serial);
        if (xxx && xxx.link) {
            return xxx.link;
        }
        return null; // Return null instead of placeholder
    };

    return (
        <View style={{ marginTop: 10 }}>
            {/* Header */}
            <View wrap={false}>
                <View>
                    <Text style={{ fontSize: "14", marginLeft: "32" }}>{title}</Text>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        fontFamily: CONFIG.BOLD,
                        marginTop: "12",
                        fontSize: "10",
                        padding: "2",
                        backgroundColor: "#CFCFCF",
                        borderBottom: "1 black solid",
                    }}
                >
                    <View>
                        <Text style={{ width: "50" }}>POS</Text>
                    </View>
                    <View>
                        <Text style={{ width: "100" }}>MUEBLE</Text>
                    </View>
                    <View>
                        <Text style={{ width: "40" }}>UD.</Text>
                    </View>
                    <View>
                        <Text style={{ width: "300" }}>DESCRIPCION</Text>
                    </View>
                    {price && (
                        <View>
                            <Text style={{ width: "70" }}>IMPORTE</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Rows */}
            {items.map((item, key) => (
                <View
                    key={key}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "1",
                        marginBottom: "5",
                    }}
                    wrap={false}
                >
                    <View style={{ width: "50", fontSize: "8" }}>
                        <Text>{contador + key}</Text>
                    </View>
                    <View style={{ height: "100", width: "100", fontSize: "8" }}>
                        {loadImage(item.obsBrandGoodId || item.obsBrandGoodId2) ? (
                            <Image
                                style={{ width: "80", height: "80" }}
                                filter={grayscaleFilter("#fff")}
                                src={loadImage(item.obsBrandGoodId || item.obsBrandGoodId2)}
                            />
                        ) : (
                            <Text style={{ fontSize: "8", color: "#999" }}>Sin imagen</Text>
                        )}
                    </View>
                    <View style={{ width: "40", fontSize: "11" }}>
                        <Text style={{ fontSize: "8" }}>{item.quantity || 1}</Text>
                    </View>
                    <View style={{ width: "300", fontSize: "8", marginBottom: 10 }}>
                        <View>
                            <Text style={{ fontFamily: CONFIG.BOLD }}>{item.reference || "N/A"}</Text>
                            <Text style={{ fontFamily: CONFIG.BOLD }}>{item.name || "Sin nombre"}</Text>
                            <Text style={{ fontSize: "8" }}>
                                L: {item.size?.x || 0} F: {item.size?.y || 0} A: {item.size?.z || 0}
                            </Text>
                            {(item.opening && item.opening !== "") ? (
                                <Text style={{ fontSize: "8" }}>M: {item?.opening || "N/A"}</Text>
                            ) : null}

                            {/* Drawer Details */}
                            {(formatNumber(item.priceDrawers, coeficiente) > 0 &&
                                item.drawerMaterialDetails?.length > 0 &&
                                item.drawerPriceDetails?.length > 0) ? (
                                <Text>
                                    - Frente: {(() => {
                                        const result = item.drawerPriceDetails
                                            .map((it, index) => {
                                                const materialDetail = item.drawerMaterialDetails[index];
                                                if (!materialDetail || it === 0) return null;
                                                const modelo = materialDetail.modelo;
                                                const acabado = materialDetail.Acabado;
                                                if (!modelo && !acabado) return null;
                                                if (modelo && acabado) return `${modelo}-${acabado}/ `;
                                                if (modelo) return `${modelo}/ `;
                                                return `${acabado}/ `;
                                            })
                                            .filter(Boolean)
                                            .join("");
                                        return result || null;
                                    })()}
                                </Text>
                            ) : null}

                            {/* Handlers */}
                            {(item.doors?.acabadoTirador || item.drawerMaterialDetails?.some(d => d?.acabadoTirador?.trim())) ? (
                                <Text>
                                    - Tiradores: {item.doors?.acabadoTirador && `${item.doors.acabadoTirador}/ `}
                                    {(() => {
                                        const result = item.drawerMaterialDetails
                                            ?.map(d => d?.acabadoTirador?.trim() && `${d.acabadoTirador}/ `)
                                            .filter(Boolean)
                                            .join("");
                                        return result || null;
                                    })()}
                                </Text>
                            ) : null}

                            {/* Doors */}
                            {(formatNumber(item.priceDoor, coeficiente) > 0) ? (
                                <Text>
                                    - Puertas:
                                    {item?.doors?.name || item?.doors?.material ? ` ${item?.doors?.name?.toLocaleUpperCase() || "N/A"}-${item?.doors?.material || "N/A"} / ` : " "}
                                </Text>
                            ) : null}

                            {/* Cabinet/Armazon */}
                            {(formatNumber(item.priceCabinet, coeficiente) > -1) ? (
                                <Text>
                                    - Armazón:
                                    <Text style={{ fontSize: "8" }}>
                                        {getMaterialName(item.material) || item.materialCabinet || "N/A"}
                                    </Text>
                                </Text>
                            ) : null}

                            {/* Variants */}
                            {(formatNumber(item.priceVariants, coeficiente) > 0) ? (
                                <View style={{ display: "flex", flexDirection: "column" }}>
                                    <Text>Variantes: </Text>
                                    {item.variants.map((it, idx) => (
                                        <Text key={idx}>
                                            {(() => {
                                                const name = it.name || "Variante";
                                                const value = String(it.description).includes("$")
                                                    ? it.value
                                                    : (it.description || it.nameValue || "N/A");
                                                const mcv = it.mcv ? `/${it.mcv}` : "";
                                                return `${name}: ${value}${mcv}`;
                                            })()}
                                        </Text>
                                    ))}
                                </View>
                            ) : null}
                        </View>

                        {/* Observations */}
                        {(showObservations && item?.observation && item.observation.length > 0 && item.observation !== "") ? (
                            <View style={{ display: "flex", flexDirection: "column" }}>
                                <Text style={{ fontFamily: CONFIG.BOLD, fontSize: 8 }}>
                                    Observaciones: {item.observation || "N/A"}
                                </Text>
                            </View>
                        ) : null}
                    </View>

                    {/* Price */}
                    {price && (
                        <View style={{ width: "70" }}>
                            <Text style={{ fontSize: "8", textAlign: "right" }}>
                                {parseFloat(item.total).toFixed(2)}
                            </Text>
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
};

export default CabinetTable;
