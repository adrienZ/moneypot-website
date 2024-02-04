<script setup lang="ts">
defineProps<{
  code: string;
  pageUrl: string;
}>();

const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
};
</script>

<template>
  <EHtml>
    <EHead />
    <EPreview>Verify your email</EPreview>
    <EBody :style="main">
      <EContainer>
        <ESection>
          <EHeading
            as="h2"
            :style="{
              fontSize: '26px',
              fontWeight: 'bold',
              textAlign: 'center'
            }"
          >
            Verify your email
          </EHeading>
          <ECodeInline
            :style="{
              fontSize: '18px',
              display: 'block',
              textAlign: 'center',
              backgroundColor: 'lightgrey'
            }"
            >{{ code }}</ECodeInline
          >

          <ESection :style="{ textAlign: 'center', marginTop: '16px' }">
            <EButton
              :href="pageUrl"
              :style="{
                backgroundColor: 'black',
                color: 'white'
              }"
              :px="16"
              :py="8"
              >Go to verification</EButton
            >
          </ESection>
          <EHr />
          <EText>{{ pageUrl }}</EText>
        </ESection>
      </EContainer>
    </EBody>
  </EHtml>
</template>
