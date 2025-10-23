import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = () => {
    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulate sending verification code
    setTimeout(() => {
      setIsLoading(false);
      setCodeSent(true);
      console.log("Verification code sent to:", username);
    }, 1500);
  };

  const handleContinue = () => {
    console.log("Continue clicked");
    // Navigate to next step
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-600">
      {/* Back Button */}
      <div className="pt-6 px-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-white text-lg font-bold hover:opacity-80 transition-opacity drop-shadow"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          BACK
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-8">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/logo.png"
            alt="DHMS logo"
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-contain shadow-2xl bg-white p-3"
          />
        </div>

        {/* Title */}
        <h1 className="text-white text-2xl sm:text-3xl font-bold text-center mb-6 tracking-wide uppercase drop-shadow-lg">
          Please Provide the following details
        </h1>

        {/* Instructions */}
        <div className="w-full max-w-md mb-6">
          <p className="text-white text-base leading-relaxed drop-shadow italic">
            When your username is not an e-mail address, please fill in your
            username and the verification code is automatically sent to your
            e-mail address.
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-md space-y-5">
          {/* Username Field */}
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white rounded-full py-6 px-6 text-gray-700 placeholder:text-gray-400 placeholder:italic border-none shadow-lg text-base focus:outline-none focus:ring-2 focus:ring-white/50"
              disabled={isLoading}
            />
            {error && (
              <p className="text-white text-sm ml-4 mt-1 drop-shadow">
                {error}
              </p>
            )}
          </div>

          {/* Send Verification Code Button */}
          <button
            type="button"
            onClick={handleSendCode}
            className="w-full bg-white text-red-600 hover:bg-gray-50 py-6 rounded-full text-xl font-bold uppercase tracking-wider shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || codeSent}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                SENDING...
              </span>
            ) : codeSent ? (
              "CODE SENT ✓"
            ) : (
              "SEND VERIFICATION CODE"
            )}
          </button>

          {/* Continue Button */}
          <button
            type="button"
            onClick={handleContinue}
            className="w-full bg-white/30 text-white hover:bg-white/40 py-6 rounded-full text-xl font-bold uppercase tracking-wider shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={!codeSent}
          >
            CONTINUE
          </button>

          {/* Success Message */}
          {codeSent && (
            <div className="text-center">
              <p className="text-white text-sm drop-shadow">
                Verification code has been sent to your email address.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cow Silhouettes at Bottom */}
      <div className="w-full px-6 pb-8 mt-auto">
        <div className="max-w-2xl mx-auto flex justify-between items-end">
          <img
            src="/cow-silhouette1.svg"
            alt="Cow"
            className="h-14 w-18 opacity-70"
          />
          <img
            src="/cow-silhouette1.svg"
            alt="Cow"
            className="h-12 w-16 opacity-70 scale-x-[-1]"
          />
          <img
            src="/cow-silhouette1.svg"
            alt="Cow"
            className="h-16 w-20 opacity-70"
          />
          <img
            src="/cow-silhouette1.svg"
            alt="Cow"
            className="h-12 w-16 opacity-70 scale-x-[-1]"
          />
          <img
            src="/cow-silhouette1.svg"
            alt="Cow"
            className="h-14 w-18 opacity-70"
          />
        </div>
      </div>
    </div>
  );
}
