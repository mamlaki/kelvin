import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapUpdater({ lat, lon }) {
  const map = useMap()

  useEffect(() => {
    map.setView([lat, lon], 10)
  }, [lat, lon, map])

  return null
}