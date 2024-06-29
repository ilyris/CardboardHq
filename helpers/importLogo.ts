const importLogo = async (pageName: string) => {
    try {
      const logo = await import(
        `@/public/Fab_assets/logos/${pageName.toLowerCase()}.png`
      );
      return logo.default;
    } catch (error) {
      console.error(`Error importing logo for ${pageName}:`, error);
      return null;
    }
  };
  export default importLogo;