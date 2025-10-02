import React from "react";

type WelcomeProps = {
  name: string;
};

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export const WelcomeMessage: React.FC<WelcomeProps> = ({ name }) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        {getGreeting()}, {name}!
      </h2>
      <p className="text-muted-foreground">
        Here’s your farm overview for today.
      </p>
    </div>
  );
};
