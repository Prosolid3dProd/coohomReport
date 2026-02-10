import { Font } from "@react-pdf/renderer";

// Register Roboto font for use in all PDF components
Font.register({
    family: 'Roboto',
    src: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
});

export { Font };
