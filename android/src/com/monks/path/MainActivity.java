package com.monks.path;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Collections;

/** Offline game hosted at a stable HTTPS origin, with no native JavaScript bridge. */
public final class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private WebView web;
    private View fullscreenView;
    private WebChromeClient.CustomViewCallback fullscreenCallback;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        web = new WebView(this);
        if ((getApplicationInfo().flags & android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        web.setBackgroundColor(0xff141916);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(false);
        web.getSettings().setAllowContentAccess(false);
        web.getSettings().setSupportMultipleWindows(false);
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !isLocal(request);
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                if (!isLocal(request) || !"GET".equals(request.getMethod())) return missing();
                String path = request.getUrl().getPath();
                if (path == null) return missing();
                if ("/".equals(path)) path = "/index.html";
                if (path.contains("..") || path.contains("\\")) return missing();
                String mime = path.endsWith(".html") ? "text/html" : path.endsWith(".js") ? "application/javascript" : path.endsWith(".css") ? "text/css" : path.endsWith(".png") ? "image/png" : "application/octet-stream";
                try {
                    return new WebResourceResponse(mime, "UTF-8", 200, "OK", Collections.singletonMap("Cache-Control", "no-cache"), getAssets().open(path.substring(1)));
                } catch (IOException error) { return missing(); }
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public void onShowCustomView(View view, CustomViewCallback callback) {
                if (fullscreenView != null) { callback.onCustomViewHidden(); return; }
                fullscreenView = view;
                fullscreenCallback = callback;
                setContentView(view);
                immersive();
            }
            @Override public void onHideCustomView() { closeFullscreen(); }
        });
        setContentView(web);
        immersive();
        web.loadUrl("https://" + HOST + "/index.html");
    }

    private static boolean isLocal(WebResourceRequest request) {
        return "https".equals(request.getUrl().getScheme()) && HOST.equals(request.getUrl().getHost());
    }
    private static WebResourceResponse missing() {
        return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
    }
    private void immersive() {
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    }
    private void closeFullscreen() {
        if (fullscreenView == null) return;
        fullscreenView = null;
        setContentView(web);
        WebChromeClient.CustomViewCallback callback = fullscreenCallback;
        fullscreenCallback = null;
        callback.onCustomViewHidden();
        immersive();
    }
    @Override public void onWindowFocusChanged(boolean focused) {
        super.onWindowFocusChanged(focused);
        if (focused) immersive();
    }
    @Override protected void onPause() {
        web.evaluateJavascript("window.dispatchEvent(new Event('blur'));", null);
        web.onPause();
        super.onPause();
    }
    @Override protected void onResume() {
        super.onResume();
        if (web != null) web.onResume();
    }
    @Override public void onBackPressed() {
        if (fullscreenView != null) { closeFullscreen(); return; }
        web.evaluateJavascript("JSON.parse(window.render_game_to_text()).mode", mode -> {
            if ("\"playing\"".equals(mode)) {
                web.evaluateJavascript("window.dispatchEvent(new KeyboardEvent('keydown',{code:'Escape'}));", null);
            } else {
                new AlertDialog.Builder(this).setTitle("לצאת מהמשחק?").setMessage("המסע נשמר במכשיר.").setPositiveButton("יציאה", (dialog, which) -> finish()).setNegativeButton("להישאר", null).show();
            }
        });
    }
    @Override protected void onDestroy() {
        web.destroy();
        super.onDestroy();
    }
}
