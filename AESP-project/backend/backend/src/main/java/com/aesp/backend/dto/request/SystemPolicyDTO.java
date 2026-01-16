package com.aesp.backend.dto.request;


public class SystemPolicyDTO {

    private String type;
    private String content;
    private String version;

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
}
