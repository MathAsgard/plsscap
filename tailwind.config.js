const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: "1rem",
				sm: "2rem",
				lg: "4rem",
				xl: "5rem",
				"2xl": "6rem",
			},
		},
		extend: {
			colors: {
				buttonColor: "#1F1E19",
				primary: "#FB9742",
				tableBg: "#140236",
				blue: "#01BCFF",
			},
			backgroundImage: {
				gradient1:
					"linear-gradient(239.74deg, #00EAFF 27.55%, #0080FF 74.48%, #8000FF 121.41%, #E619E6 168.34%, #FF0000 215.27%)",
				gradient3:
					"linear-gradient(180deg, #00EAFF20 0%, #0080FF50 35%, #8000FF 70%, #E619E6 85%)",
				gradient2:
					"linear-gradient(0deg, #130833, #130833), linear-gradient(180deg, #04010F 0%, #0B0021 25.5%, #17003C 47.5%, #2E016A 68%, #480188 83%, #700792 100%)",
				gradient4:
					"linear-gradient(180deg, #00EAFF 0%, #0080FF 25%, #8000FF 50%, #E619E6 75%)",
				gradient4Light:
					"linear-gradient(180deg, #00EAFF20 15%, #0080FF 25%, #8000FF 50%, #E619E6 75%)",
				gradient5:
					"linear-gradient(360deg, #00EAFF20 0%, #0080FF30 25%, #8000FF50 50%, #E619E650 75%)",
				tableRowBorder:
					"linear-gradient(360deg, #00EAFF20 0%, #0080FF30 25%, #8000FF30 50%, #8000FF70 75%)",
				gradient6: "linear-gradient(180deg, #0C0212 0%, #1F025C 100%)",
				gradient7:
					"linear-gradient(90deg, #9506F9 0%, #B239FA 26%, #DB39F8 49.5%, #EF68DC 75.5%, #F7DBB2 100%)",
				gradient8:
					"linear-gradient(90deg, #9506F9 0%, #B239FA 26%, #DB39F8 49.5%, #0080FF 75.5%, #00EAFF 100%)",
				tableGradient:
					"linear-gradient(90deg, #9506F9 0%, #B239FA 26%, #DB39F8 49.5%, #0080FF 75.5%, #00EAFF 100%)",
				footerBg:
					"linear-gradient(0deg, #070115, #070115), linear-gradient(180deg, #04010F 0%, #0B0021 25.5%, #17003C 47.5%, #2E016A 68%, #480188 83%, #700792 100%)",
				menuHover:
					"linear-gradient(235.48deg, #D8308D -7.21%, #F03DA8 -7.21%, #E17737 121.49%), linear-gradient(180deg, #9C32F8 0%, #EAA5C7 100%)",
				assetCard:
					"linear-gradient(360deg, #00EAFF00 0%, #0080FF30 25%, #8000FF30 50%, #8000FF70 75%)",
				countDown: "linear-gradient(180deg, #39106D 0%, #13003E 100%)",
				gradient9: "linear-gradient(180deg, #5D35A5 0%, #180E2A80 100%)",
				gradient10:
					"linear-gradient( 90deg,  #9506f9 0%, #b239fa 26%, #db39f8 49.5%, #ef68dc 75.5%, #f7dbb2 100%)",
				gradient11: "linear-gradient(180deg, #150238 0%, #31097B 100%)",
				gradient12:
					"linear-gradient(240deg, #00EAFF 27.55%, #0080FF 74.48%, #8000FF 121.41%, #E619E6 168.34%, #F00 215.27%)",
				whiteGradient: "linear-gradient(180deg, #FFF 0%, #999 100%)",
				unstakeGradient:
					"linear-gradient(180deg, #390A8F 0%, #1C0050 100%)",
				lpDetailsGradient:
					"linear-gradient(180deg, #04010F 0%, #0B0021 25.5%, #17003C 47.5%, #2E016A 68%, #480188 83%, #700792 100%)",
				pageHeader:
					"linear-gradient(180deg, #5D35A5 0%, rgba(24, 14, 42, 0.5) 100%)",
				menuItemHover:
					"linear-gradient(0deg, #070115, #070115), linear-gradient(180deg, #04010F 0%, #0B0021 25.5%, #17003C 47.5%, #2E016A 68%, #480188 83%, #700792 100%)",
				uncheckbg: "linear-gradient(45deg, #d8308d, #F7DBB2)",
				checkbg:
					"linear-gradient(-90deg, #00EAFF 0%, #0080FF 15%, #8000FF 50%, #E619E6 75%)",
				stockvoult:
					"linear-gradient(90deg, #9506F9 0%, #B239FA 26%, #DB39F8 49.5%, #3D44FF 75.5%, #01EAFF 100%)",
			},
			fontFamily: {
				urbanist: ["'Urbanist'", "sans-serif"],
			},
			fontSize: {
				xs: ["12px", { lineHeight: "20px" }],
				sm: ["14px", { lineHeight: "22px" }],
				normal: ["16px", { lineHeight: "24px" }],
				md: ["18px", { lineHeight: "28px" }],
				lg: ["20px", { lineHeight: "27px" }],
				xl: ["24px", { lineHeight: "34px" }],
				"2xl": ["28px", { lineHeight: "34px" }],
				"3xl": ["30px", { lineHeight: "38px" }],
				"4xl": ["32px", { lineHeight: "38px" }],
				"5xl": ["36px", { lineHeight: "42px" }],
				"6xl": ["42px", { lineHeight: "48px" }],
			},
			boxShadow: {
				buttonShadow: "0px 3px 4px rgba(0, 0, 0, 0.15)",
				chipShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
				menuShadow: "-8px 0px 8px rgba(0, 0, 0, 0.25)",
				innerShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
				cardShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.50)",
			},
			spacing: {
				108: "8px",
				114: "14px",
				115: "15px",
				116: "16px",
				118: "18px",
				120: "20px",
				130: "30px",
				136: "36px",
				138: "38px",
				148: "48px",
				150: "50px",
			},
		},
	},
	darkMode: "selector",
	plugins: [],
});
