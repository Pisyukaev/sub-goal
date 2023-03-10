import { useEffect, useMemo, useRef } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import {
  GOAL_WIDGET,
  GW_IMAGE,
  GW_PROGRESS_BAR,
  LEFT_TEXT,
  RIGHT_TEXT
} from "./constants"
import type { SelectorProps } from "./types"

export const useElements = () => {
  const widgetBody = useRef(document.querySelector<HTMLDivElement>(GOAL_WIDGET))
  const image = useRef(document.querySelector<HTMLImageElement>(GW_IMAGE))
  const leftText = useRef(document.querySelector<HTMLDivElement>(LEFT_TEXT))
  const rightText = useRef(document.querySelector<HTMLDivElement>(RIGHT_TEXT))
  const progressBar = useRef(
    document.querySelector<HTMLDivElement>(GW_PROGRESS_BAR)
  )

  return {
    [GOAL_WIDGET]: widgetBody.current,
    [GW_IMAGE]: image.current,
    [LEFT_TEXT]: leftText.current,
    [RIGHT_TEXT]: rightText.current,
    [GW_PROGRESS_BAR]: progressBar.current
  }
}

export const useDefaultStyles = () => {
  const elements = useElements()

  const styles = useRef({
    [GOAL_WIDGET]: {
      "background-color": elements[GOAL_WIDGET].style.backgroundColor
    },
    [GW_PROGRESS_BAR]: {
      "background-color": elements[GW_PROGRESS_BAR].style.backgroundColor
    },
    [LEFT_TEXT]: { color: elements[LEFT_TEXT].style.color },
    [RIGHT_TEXT]: { color: elements[RIGHT_TEXT].style.color },
    [GW_IMAGE]: {
      content: `url(${elements[GW_IMAGE].src})`
    }
  })

  const [defaultStyles] = useStorage(
    "defaultStyles",
    (value) => value ?? styles.current
  )

  return defaultStyles
}

export const useStyles = () => {
  const elements = useElements()
  const defaultStyles = useDefaultStyles()
  const [styles, setStyles] = useStorage("customStyles", (value) =>
    value
      ? {
          [GOAL_WIDGET]: {
            ...defaultStyles[GOAL_WIDGET],
            ...value[GOAL_WIDGET]
          },
          [GW_PROGRESS_BAR]: {
            ...defaultStyles[GW_PROGRESS_BAR],
            ...value[GW_PROGRESS_BAR]
          },
          [LEFT_TEXT]: {
            ...defaultStyles[LEFT_TEXT],
            ...value[LEFT_TEXT]
          },
          [RIGHT_TEXT]: {
            ...defaultStyles[RIGHT_TEXT],
            ...value[RIGHT_TEXT]
          },
          [GW_IMAGE]: {
            ...defaultStyles[GW_IMAGE],
            ...value[GW_IMAGE]
          }
        }
      : defaultStyles
  )

  const updElementStyles = (selector: string, prop: string, value: string) => {
    elements[selector].style[prop] = value
  }

  const updateStyle = (selector: string, prop: string, value: string) => {
    setStyles({ ...styles, [selector]: { ...styles[selector], [prop]: value } })
  }

  useEffect(() => {
    for (const selector in styles) {
      for (const prop in styles[selector]) {
        updElementStyles(selector, prop, styles[selector][prop])
      }
    }
  }, [styles])

  const resetStyles = () => setStyles(defaultStyles)

  return {
    styles,
    updElementStyles,
    resetStyles,
    updateStyle
  }
}

export const useData = () => {
  const { styles } = useStyles()
  const data = useMemo<SelectorProps[]>(
    () => [
      {
        value: GOAL_WIDGET,
        label: "Goal widget background",
        color: styles[GOAL_WIDGET]["background-color"],
        property: "background-color"
      },
      {
        value: GW_PROGRESS_BAR,
        label: "Progress bar",
        color: styles[GW_PROGRESS_BAR]["background-color"],
        property: "background-color"
      },
      {
        value: LEFT_TEXT,
        label: "Left text",
        color: styles[LEFT_TEXT]["color"],
        property: "color"
      },
      {
        value: RIGHT_TEXT,
        label: "Right text",
        color: styles[RIGHT_TEXT]["color"],
        property: "color"
      }
    ],
    [styles]
  )

  return data
}
