import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { useToggle } from '@mantine/hooks'
import React, { FC } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { appStore } from './redux'
import { AppRoutes } from './core'
import './assets/scss/style.scss'

const Main: FC = () => {
  const [colorScheme, toggleColorScheme] = useToggle<ColorScheme>(['dark', 'light'])
  return (
    <Provider store={appStore}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme }}>
          <AppRoutes />
        </MantineProvider>
      </ColorSchemeProvider>
    </Provider>
  )
}
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Main />)
