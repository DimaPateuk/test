import React from "react";
import ReactDOM from "react-dom";

const themes = {
    dark: {
        background: 'darkblue',
    },
    light: {
        background: 'lightblue'
    }
};
const ThemeContext = React.createContext({
    theme: themes.dark,
    toggleTheme: () => {}
});
class App extends React.Component {
    constructor(props) {
        super(props);

        this.toggleTheme = () => {
            this.setState(state => ({
                theme: state.theme === themes.dark ? themes.light : themes.dark
            }));
        };

        // State also contains the updater function so it will
        // be passed down into the context provider
        this.state = {
            theme: themes.light,
            toggleTheme: this.toggleTheme
        };
    }

    render() {
        // The entire state is passed to the provider
        return (
            <ThemeContext.Provider value={this.state}>
                <Content />
            </ThemeContext.Provider>
        );
    }
}

function ThemeTogglerButton() {
    // The Theme Toggler Button receives not only the theme
    // but also a toggleTheme function from the context
    return (
        <ThemeContext.Consumer>
            {({ theme, toggleTheme }) => (
                <button
                    onClick={toggleTheme}
                    style={{ backgroundColor: theme.background }}
                >
                    Toggle Theme
                </button>
            )}
        </ThemeContext.Consumer>
    );
}

function Content() {
    return (
        <div>
            <ThemeTogglerButton />
        </div>
    );
}
const app = document.createElement("div");
document.body.appendChild(app);
ReactDOM.render(<App />, app);
