package com.hci.bachelorproject.tactileCalendar;

import android.content.Context;
import android.net.ParseException;
import android.os.Handler;
import android.speech.tts.TextToSpeech;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;

import com.google.api.client.extensions.android.http.AndroidHttp;
import com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAccountCredential;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.hci.bachelorproject.webapplib.JSAppInterface;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import de.hpi.hci.bachelorproject2016.bluetoothlib.SVGTransmitter;

/**
 * Created by Julius on 01.03.2017.
 */

public class CalendarWebAppInterface extends JSAppInterface {

    public void setmService(com.google.api.services.calendar.Calendar mService) {
        this.mService = mService;
    }

    com.google.api.services.calendar.Calendar mService = null;
    public void setGoogleCalendarEvents(List<Event> googleCalendarEvents) {
        this.googleCalendarEvents = googleCalendarEvents;
    }

    List<Event> googleCalendarEvents;
    List<Event> newEvents;
    /** Instantiate the interface and set the context */
    public CalendarWebAppInterface(Context c, WebView webView, com.google.api.services.calendar.Calendar service) {
        super(c,webView,false);
        this.mService = service;

    }

    @Override
    protected void setupTTS(){
        this.tts = new TextToSpeech(mContext, new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int i) {
                /*tts.speak("Welcome to your tactile calendar. This app supports speech recognition that you can start by shaking your phone." +
                                "      + \"If you want you can now print your current Google Calendar by saying 'print'. Double check that your Linepod is turned on, a piece of swell paper is inserted " +
                                "      \"and that the lid is closed if you want to print. Otherwise, if you already havwe a printed calendar you can Also you can say 'options' or 'help' at anytime if you're stuck and don't know what to do. "
                        , TextToSpeech.QUEUE_ADD,null);*/
                tts.speak("Welcome to your tactile calendar. This app supports speech recognition that you can start by shaking your phone. It assumes that you already have a printed tactile calendar of the current week." +
                        " If you want to interact with your calendar now, insert your calendar in the Linepod, pull it in by pressing the second button in the upper-right corner on the Linepod and then say 'start' after opening the speech-recognition. Also you can say 'options' or 'help' at anytime if you're stuck and don't know what to do. "
                , TextToSpeech.QUEUE_ADD,null,"");

            }
        });
    }

    @JavascriptInterface
    public void startSVGTransmitter(final boolean instantPrint){
        Log.d("SvgTransmitter", "starting svg transmitter");
        if (this.svgTransmitter==null){

            createNewSVGTransmitter();

        } else {
            if (this.svgTransmitter.getPrinterConnector()==null){
                createNewSVGTransmitter();

            } else {
                if (this.svgTransmitter.getPrinterConnector().getConnection()==null){
                    createNewSVGTransmitter();
                } else {
                    if (!this.svgTransmitter.getPrinterConnector().getConnection().isConnected()){
                        createNewSVGTransmitter();
                    }
                }
            }
        }
        if (instantPrint){
            webView.post((new Runnable() {
                @Override
                public void run() {
                    webView.loadUrl("javascript:printSVG();");
                }
            }));
        } else {
            webView.post((new Runnable() {
                @Override
                public void run() {
                    webView.loadUrl("javascript:simulateFirstPrint();");
                }
            }));
        }
    }

    private void createNewSVGTransmitter(){
        Log.d("SVGTransmitter", "creating new svg transmitter");
        Handler handler = new Handler();
        handler.post(new Runnable() {
            @Override
            public void run() {

                if (svgTransmitter!= null) {
                    svgTransmitter.stopPrinterConnector();
                }
                svgTransmitter = new SVGTransmitter(mContext, webView);
            }
        });
    }

    private String eventsToJSON(List<Event> events){
        JSONObject obj = new JSONObject();
        JSONArray jsonArray = new JSONArray();
        for (Event event: events){

            jsonArray.put(event.toString());
        }
        try {
            obj.put("events",jsonArray);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj.toString();

    }

    //google calendar method
    @JavascriptInterface
    public String getGoogleCalendarEvents() {
        Log.d("cal-events", eventsToJSON(googleCalendarEvents));
        return eventsToJSON(googleCalendarEvents);
    }
    @JavascriptInterface
    public String getNewEvents(){
        Log.d("new events", eventsToJSON(newEvents));
        return eventsToJSON(newEvents);
    }

    @JavascriptInterface
    public void createEvent(String name, String startTime, String endTime){

        Log.d("interface", "start "+ startTime);
        Log.d("interface", "end "+ endTime);


        Event event = new Event().setSummary(name);

        DateTime startDateTime = new DateTime(startTime);
        EventDateTime start = new EventDateTime()
                .setDateTime(startDateTime);
        event.setStart(start);

        DateTime endDateTime = new DateTime(endTime);
        EventDateTime end = new EventDateTime()
                .setDateTime(endDateTime);
        event.setEnd(end);
        Log.i("Starttime", start.toString());
        Log.i("Endtime", end.toString());


        String calendarId = "primary";
        try {
            Log.i("Calendar access", "" + mService.calendarList().get(calendarId).execute().getAccessRole());

        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            event = mService.events().insert(calendarId, event).execute();
        } catch (IOException e) {
            e.printStackTrace();
        }

        newEvents = new ArrayList<>();
        newEvents.add(event);
        System.out.printf("Event created: %s\n", event.getHtmlLink());
        webView.post((new Runnable() {
            @Override
            public void run() {
                webView.loadUrl("javascript:getNewEventsFromAndroid();");

                startSVGTransmitter(true);
            }
        }));

    }

    //google calendar method
    @JavascriptInterface
    public String getEventProperty(int id, String property) {
        return googleCalendarEvents.get(id).get(property).toString();
    }


}