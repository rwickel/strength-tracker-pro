package com.strengthtrackerpro.app;

import android.os.Bundle;
import android.view.View;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // 1. Tell the window we want to handle the layout ourselves
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        // 2. Find the root view of your app
        View rootView = getWindow().getDecorView().findViewById(android.R.id.content);

        // 3. Apply padding to the root view equal to the status bar (top) and navigation bar (bottom) height
        ViewCompat.setOnApplyWindowInsetsListener(rootView, (v, insets) -> {
            int top = insets.getInsets(WindowInsetsCompat.Type.statusBars()).top;
            int bottom = insets.getInsets(WindowInsetsCompat.Type.navigationBars()).bottom;
            v.setPadding(0, top, 0, bottom);
            return insets;
        });
    }
}
