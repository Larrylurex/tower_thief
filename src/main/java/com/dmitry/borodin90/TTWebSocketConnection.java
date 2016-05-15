package com.dmitry.borodin90;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicInteger;

@ServerEndpoint(value = "/websocket/chat")
public class TTWebSocketConnection {
    private static final String GUEST_PREFIX = "Guest";
    private static final AtomicInteger connectionIds = new AtomicInteger(0);
    private static final Set<TTWebSocketConnection> connections =
            new CopyOnWriteArraySet<>();
    private static Map<String, Point> points = new HashMap<>();
    private final String nickname;
    private Session session;

    public TTWebSocketConnection() {
        nickname = GUEST_PREFIX + connectionIds.getAndIncrement();
    }


    @OnOpen
    public void start(Session session) {
        this.session = session;
        connections.add(this);
        String message = String.format("* %s %s", nickname, "has joined.");
        //broadcast();
    }


    @OnClose
    public void end() {
        connections.remove(this);
        String message = String.format("* %s %s",
                nickname, "has disconnected.");
        //broadcast();
    }


    @OnMessage
    public void incoming(String message) throws ParseException {
        JSONParser parser = new JSONParser();
        JSONObject jsonObj = (JSONObject) parser.parse(message);
        points.put((String)jsonObj.get("color"), new Point((long)jsonObj.get("x"),(long)jsonObj.get("y")));

        broadcast();
    }

    @OnError
    public void onError(Throwable t) throws Throwable {
        System.out.println("Chat Error: " + t.toString());
    }


    private static void broadcast() {
        for (TTWebSocketConnection client : connections) {
            try {
                synchronized (client) {
                    JSONObject msg = new JSONObject();
                    msg.putAll(points);
                    client.session.getBasicRemote().sendText(msg.toJSONString());
                }
            } catch (IOException e) {
                System.out.println("Chat Error: Failed to send message to client");
                connections.remove(client);
                try {
                    client.session.close();
                } catch (IOException e1) {
                    // Ignore
                }
                String message = String.format("* %s %s",
                        client.nickname, "has been disconnected.");
                //broadcast(message);
            }
        }
    }
}