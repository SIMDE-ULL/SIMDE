import * as React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { toggleLoadModal, toggleAuthorModal, toggleOptionsModal, toggleSuperConfigModal,
    toggleBatchModal, toggleSuperescalarLoadContentModal } from '../../../actions/modals';

import { bindActionCreators } from 'redux';
import { DropdownButton } from 'react-bootstrap';
import Dropdown from "react-bootstrap/Dropdown";
import { viewBasicBlocks } from '../../../actions';
import { downloadJsonFile, downloadTextFile } from '../../../utils/Downloader';
import SuperescalarIntegration from '../../../../integration/superescalar-integration';

class FileBarComponent extends React.Component<any, any> {
    private color: boolean;

    constructor(public props: any) {
        super(props);
        this.color = false;

        this.downloadContentFile = this.downloadContentFile.bind(this);
        this.downloadCodeFile = this.downloadCodeFile.bind(this);
    }

    downloadContentFile() {
        if (SuperescalarIntegration.contentIntegration) {
            downloadTextFile('content.txt', SuperescalarIntegration.contentIntegration.deparse());
        }
    }

    downloadCodeFile() {
        if (SuperescalarIntegration.superescalar.code) {
            downloadTextFile('code.txt', SuperescalarIntegration.superescalar.code.save());
        }
    }

    render() {
        return (<Dropdown className='smd-filebar'>
                    <DropdownButton
                        title={this.props.t('fileBar.file.name')}
                        key={'dropdown-load'}
                        id={'dropdown-load'}
                    >
                        <Dropdown.Item eventKey="1" onClick={() => { this.props.actions.toggleLoadModal(true) }}>{this.props.t('fileBar.file.load')}</Dropdown.Item>
                        <Dropdown.Item eventKey="2" onClick={() => { downloadJsonFile('memory.json', this.props.memory); }}>{this.props.t('fileBar.file.download_memory')}</Dropdown.Item>
                        <Dropdown.Item eventKey="3" onClick={() => { this.downloadContentFile(); }}>{this.props.t('fileBar.file.download_content')}</Dropdown.Item>
                        <Dropdown.Item eventKey="4" onClick={() => { this.downloadCodeFile(); }}>{this.props.t('fileBar.file.download_code')}</Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton
                        title={this.props.t('fileBar.view.name')}
                        key={'dropdown-view'}
                        id={'dropdown-view'}
                    >
                        <Dropdown.Item eventKey="1" onClick={() => {
                            this.color = !this.color;
                            this.props.actions.viewBasicBlocks(this.color);
                        }}>{this.props.t('fileBar.view.basicBlocks')}</Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton
                        title={this.props.t('fileBar.config.name')}
                        key={'dropdown-options'}
                        id={'dropdown-options'}
                    >
                        <Dropdown.Item eventKey="1" onClick={() => { this.props.actions.toggleSuperConfigModal(true)}}>
                            {this.props.t('fileBar.config.superescalar')}
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="1" onClick={() => { this.props.actions.toggleSuperescalarLoadContentModal(true)}}>
                            {this.props.t('fileBar.config.content')}
                        </Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton
                        title={this.props.t('fileBar.experimentation.name')}
                        key={'dropdown-experimentation'}
                        id={'dropdown-experimentation'}
                    >
                        <Dropdown.Item eventKey="2" onClick={() => { this.props.actions.toggleBatchModal(true) }}>
                            {this.props.t('fileBar.experimentation.batch')}
                        </Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton
                        title={this.props.t('fileBar.help.name')}
                        key={'dropdown-help'}
                        id={'dropdown-help'}
                    >
                        <Dropdown.Item eventKey="1" href="https://etsiiull.gitbooks.io/simde/">
                            {this.props.t('fileBar.help.docs')}
                        </Dropdown.Item>

                        <Dropdown.Item eventKey="2" onClick={() => { this.props.actions.toggleAuthorModal(true) }}>{this.props.t('fileBar.help.about')}</Dropdown.Item>
                    </DropdownButton>
        </Dropdown>);
    }
}

const mapStateToProps = state => {
    return {
        isLoadModalOpen: state.isLoadModalOpen,
        memory: state.Machine.memory
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({ 
        toggleLoadModal,
        toggleAuthorModal,
        toggleOptionsModal,
        toggleSuperConfigModal,
        toggleSuperescalarLoadContentModal,
        toggleBatchModal,
        viewBasicBlocks
    }, dispatch) };
}


export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(FileBarComponent));
