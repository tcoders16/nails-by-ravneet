"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Copy, Check } from "lucide-react";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/cursor/CustomCursor"), { ssr: false });
import { useParams } from "next/navigation";

type CallStatus = "idle" | "waiting" | "connecting" | "connected" | "ended" | "error";

export default function CallPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [status, setStatus] = useState<CallStatus>("idle");
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [copied, setCopied] = useState(false);
  const [role, setRole] = useState<"host" | "guest" | null>(null);
  const [peerCount, setPeerCount] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<import("peerjs").Peer | null>(null);
  const callRef = useRef<import("peerjs").MediaConnection | null>(null);

  const hostId = `nailstisha-${roomId}-host`;
  const guestId = `nailstisha-${roomId}-guest`;

  const cleanup = useCallback(() => {
    callRef.current?.close();
    peerRef.current?.destroy();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const startCall = useCallback(async (asHost: boolean) => {
    setStatus("waiting");
    setRole(asHost ? "host" : "guest");

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch {
      setStatus("error");
      return;
    }
    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const { Peer } = await import("peerjs");
    const myId = asHost ? hostId : guestId;
    const peerId = asHost ? guestId : hostId;

    const peer = new Peer(myId, { debug: 0 });
    peerRef.current = peer;

    peer.on("open", () => {
      setStatus("waiting");
      if (!asHost) {
        // Guest calls host
        attemptCall(peer, peerId, stream);
      }
    });

    peer.on("call", (call) => {
      callRef.current = call;
      call.answer(stream);
      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setStatus("connected");
        setPeerCount((n) => n + 1);
      });
      call.on("close", () => setStatus("ended"));
    });

    peer.on("error", (err) => {
      // If ID is taken, try the other role
      if (err.type === "unavailable-id") {
        peer.destroy();
        startCall(!asHost);
      } else {
        setStatus("error");
      }
    });

    // If host, poll for guest joining
    if (asHost) {
      const interval = setInterval(() => {
        if (peerRef.current && !callRef.current) {
          attemptCall(peerRef.current, guestId, stream);
        } else {
          clearInterval(interval);
        }
      }, 3000);
    }
  }, [hostId, guestId]); // eslint-disable-line react-hooks/exhaustive-deps

  function attemptCall(peer: import("peerjs").Peer, peerId: string, stream: MediaStream) {
    setStatus("connecting");
    const call = peer.call(peerId, stream);
    if (!call) return;
    callRef.current = call;
    call.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      setStatus("connected");
      setPeerCount((n) => n + 1);
    });
    call.on("close", () => setStatus("ended"));
    call.on("error", () => setStatus("waiting"));
    // If no answer in 4s, reset and wait
    setTimeout(() => {
      if (status !== "connected") {
        callRef.current = null;
        setStatus("waiting");
      }
    }, 4000);
  }

  function toggleMute() {
    localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = muted; });
    setMuted((m) => !m);
  }

  function toggleCam() {
    localStreamRef.current?.getVideoTracks().forEach((t) => { t.enabled = camOff; });
    setCamOff((c) => !c);
  }

  function endCall() {
    cleanup();
    setStatus("ended");
  }

  useEffect(() => () => cleanup(), [cleanup]);

  const callUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <CustomCursor />

      {/* Brand */}
      <div style={{ position: "fixed", top: "1.25rem", left: "1.5rem", fontFamily: "var(--font-great-vibes)", fontSize: "1.4rem", color: "#fff", opacity: 0.7 }}>
        Nails by Tisha
      </div>

      {/* Share link */}
      <div style={{ position: "fixed", top: "1.25rem", right: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.07)", padding: "0.5rem 1rem", borderRadius: "100px" }}>
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>Share link</span>
        <button
          onClick={() => { navigator.clipboard.writeText(callUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          style={{ background: "none", border: "none", color: copied ? "#8B1930" : "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex" }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>

      {/* Idle — join screen */}
      {status === "idle" && (
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(139,25,48,0.15)", border: "1.5px solid #8B1930", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <Video size={24} style={{ color: "#8B1930" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "2rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>
            Join Consultation
          </h1>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "2rem" }}>
            Room: <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{roomId}</span><br />
            Your camera and microphone will be requested.
          </p>
          <button
            onClick={() => startCall(true)}
            style={{ background: "#8B1930", color: "#fff", fontFamily: "var(--font-poppins)", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.9rem 2.5rem", borderRadius: "100px", border: "none", cursor: "pointer", width: "100%" }}
          >
            Join Call
          </button>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", marginTop: "1rem" }}>
            Both participants use this same link
          </p>
        </div>
      )}

      {/* Active call */}
      {status !== "idle" && status !== "ended" && (
        <div style={{ width: "100%", maxWidth: 960, display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Status bar */}
          <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: status === "connected" ? "#4ade80" : "rgba(255,255,255,0.4)" }}>
              {status === "waiting" && "⏳  Waiting for the other person…"}
              {status === "connecting" && "🔗  Connecting…"}
              {status === "connected" && "● Connected"}
              {status === "error" && "⚠ Could not access camera/mic"}
            </span>
          </div>

          {/* Video grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }} className="grid-cols-1 sm:grid-cols-2">

            {/* Remote */}
            <div style={{ position: "relative", background: "#1A1A1A", borderRadius: "20px", overflow: "hidden", aspectRatio: "16/9" }}>
              <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              {status !== "connected" && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Video size={22} style={{ color: "rgba(255,255,255,0.3)" }} />
                  </div>
                </div>
              )}
              <div style={{ position: "absolute", bottom: "0.75rem", left: "0.75rem", fontFamily: "var(--font-poppins)", fontSize: "0.62rem", color: "rgba(255,255,255,0.7)", background: "rgba(0,0,0,0.5)", padding: "0.25rem 0.6rem", borderRadius: "6px" }}>
                {role === "host" ? "Client" : "Tisha"}
              </div>
            </div>

            {/* Local */}
            <div style={{ position: "relative", background: "#1A1A1A", borderRadius: "20px", overflow: "hidden", aspectRatio: "16/9" }}>
              <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: "scaleX(-1)" }} />
              {camOff && (
                <div style={{ position: "absolute", inset: 0, background: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <VideoOff size={24} style={{ color: "rgba(255,255,255,0.3)" }} />
                </div>
              )}
              <div style={{ position: "absolute", bottom: "0.75rem", left: "0.75rem", fontFamily: "var(--font-poppins)", fontSize: "0.62rem", color: "rgba(255,255,255,0.7)", background: "rgba(0,0,0,0.5)", padding: "0.25rem 0.6rem", borderRadius: "6px" }}>
                You
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "0.5rem" }}>
            <button
              onClick={toggleMute}
              style={{ width: 52, height: 52, borderRadius: "50%", background: muted ? "#8B1930" : "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "background 0.2s" }}
            >
              {muted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button
              onClick={toggleCam}
              style={{ width: 52, height: 52, borderRadius: "50%", background: camOff ? "#8B1930" : "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "background 0.2s" }}
            >
              {camOff ? <VideoOff size={18} /> : <Video size={18} />}
            </button>
            <button
              onClick={endCall}
              style={{ width: 60, height: 60, borderRadius: "50%", background: "#c0392b", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Ended */}
      {status === "ended" && (
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "2rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>Call Ended</h2>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", marginBottom: "2rem" }}>Thanks for your consultation with Tisha!</p>
          <a href="/" style={{ background: "#8B1930", color: "#fff", fontFamily: "var(--font-poppins)", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.9rem 2.5rem", borderRadius: "100px", textDecoration: "none", display: "inline-block" }}>
            Back to Site
          </a>
        </div>
      )}
    </div>
  );
}
